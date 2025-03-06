import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GifsService } from 'src/app/gifs/services/gifs.service';

interface MenuOption {
  icon: string
  label: string
  subLabel: string
  route: string
}

@Component({
  selector: 'gifs-side-menu-options',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './gifs-side-menu-options.component.html',
})
export class GifsSideMenuOptionsComponent {
  gifService = inject(GifsService)

  menuOptions: MenuOption[] = [
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Trending',
      subLabel: 'Gifs populares',
      route: '/dashboard/trending'
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      label: 'Search',
      subLabel: 'Buscador Gifs',
      route: '/dashboard/search'
    },
  ]
 }
