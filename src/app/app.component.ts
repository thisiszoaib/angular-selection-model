import { SelectionModel } from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  NgZone,
} from '@angular/core';
import { timer } from 'rxjs';
import { filter, map, pairwise, throttleTime } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AppComponent {
  @ViewChild(CdkVirtualScrollViewport)
  scroller!: CdkVirtualScrollViewport;

  listItems: any[] = [];

  loading = false;

  selection = new SelectionModel<any>(true, []);

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.fetchMore();
  }

  ngAfterViewInit() {
    this.scroller
      .elementScrolled()
      .pipe(
        map(() => this.scroller.measureScrollOffset('bottom')),
        pairwise(),
        filter(([y1, y2]) => y2 < y1 && y2 < 140),
        throttleTime(200)
      )
      .subscribe(() => {
        this.ngZone.run(() => {
          this.fetchMore();
        });
      });
  }

  fetchMore(): void {
    const images = [
      'IuLgi9PWETU',
      'fIq0tET6llw',
      'xcBWeU4ybqs',
      'YW3F-C5e8SE',
      'H90Af2TFqng',
    ];

    const newItems: any[] = [];
    for (let i = 0; i < 20; i++) {
      const randomListNumber = Math.round(Math.random() * 100);
      const randomPhotoId = Math.round(Math.random() * 4);
      newItems.push({
        title: 'List Item ' + randomListNumber,
        content:
          'This is some description of the list - item # ' + randomListNumber,
        image: `https://source.unsplash.com/${images[randomPhotoId]}/50x50`,
      });
    }

    this.loading = true;
    timer(1000).subscribe(() => {
      this.loading = false;
      this.listItems = [...this.listItems, ...newItems];
    });
  }

  get allSelected(): boolean {
    return (
      !!this.listItems.length &&
      this.selection.selected.length === this.listItems.length
    );
  }

  toggleMasterSelection() {
    if (this.allSelected) {
      this.selection.clear();
    } else {
      this.selection.select(...this.listItems);
    }
  }
}
