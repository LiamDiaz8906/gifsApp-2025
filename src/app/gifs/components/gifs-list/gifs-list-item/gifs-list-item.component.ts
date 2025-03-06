import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'gifs-list-item',
  standalone: true,
  imports: [],
  templateUrl: './gifs-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GifsListItemComponent {
  imageUrl = input.required<string>()
 }
