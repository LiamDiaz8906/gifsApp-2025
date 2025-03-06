import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import type { GiphyResponse } from '../interfaces/giphy.interfaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gifs.mapper';
import { map, tap } from 'rxjs';

const loadFromLocalStorage = () => {
  const history = localStorage.getItem('history') ?? '{}'
  const gifs = JSON.parse(history)

  return gifs
}

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private http = inject(HttpClient)

  trendingGifs = signal<Gif[]>([])
  trendingGifsLoading = signal<boolean>(false)
  private trendingPage = signal(0)

  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = []
    for (let i = 0; i < this.trendingGifs().length; i+=3) {
      groups.push(this.trendingGifs().slice(i, i + 3))
    }

    return groups
  })

  searchHistory = signal<Record<string, Gif[]>>( loadFromLocalStorage() )
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()))

  constructor() {
    this.loadTrendingGifs()
  }

  saveToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory())
    localStorage.setItem('history', historyString)
  })

  loadTrendingGifs() {
    if (this.trendingGifsLoading()) return

    this.trendingGifsLoading.set(true)

    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
        offset: this.trendingPage() * 20
      }
    }).subscribe((response) => {
      const gifs = GifMapper.mapGiphyItemsToGigArray(response.data)
      this.trendingGifs.update(currentGifs => [
        ...currentGifs,
        ...gifs
      ])
      this.trendingPage.update((current) => current + 1)
      this.trendingGifsLoading.set(false)
    })
  }

  searchGifs(query: string) {
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        q: query,
        limit: 20
      }
    }).pipe(
      map(({data}) => data),
      map((items) => GifMapper.mapGiphyItemsToGigArray(items)),
      tap((items) => {
        this.searchHistory.update((history) => ({
          ...history,
          [query.toLowerCase()]: items
        }))
      })
    )
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? []
  }

}
