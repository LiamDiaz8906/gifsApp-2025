import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GifsListItemComponent } from "./gifs-list-item/gifs-list-item.component";
import { Gif } from '../../interfaces/gif.interface';

@Component({
  selector: 'gifs-list',
  standalone: true,
  imports: [GifsListItemComponent],
  templateUrl: './gifs-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifsListComponent {
  gifs = input.required<Gif[]>()
 }
