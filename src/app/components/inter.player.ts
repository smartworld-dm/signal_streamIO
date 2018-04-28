import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import {VgAPI} from '../signal-player/core/services/vg-api'
import * as path from 'path'

export interface IMedia {
  src: string;
}

@Component({
  selector: 'smart-playlist',
  template: `
    <signal-player  style="width: 100vw; height: 100vh" (onPlayerReady)="onPlayerReady($event)">

      <!--<vg-overlay-play></vg-overlay-play>-->
      <!--<vg-buffering></vg-buffering>

      <vg-scrub-bar >
        <vg-scrub-bar-current-time></vg-scrub-bar-current-time>
      </vg-scrub-bar>

      <vg-controls>

        <vg-fullscreen></vg-fullscreen>
      </vg-controls>-->

npm run 


      <video #masterRef
           [vgMedia]="masterRef"
           [vgMaster]="false"
           [src]="currentItem.src"
           id="singleVideo"
           muted 
           [autoplay]="autoplay"
           crossorigin>
    </video>
  </signal-player>

  <ul *ngIf="dev" class="status"  style="color: #FFF; position: absolute;">
    <!--<p class="status time text">{{ media?.currentTime }} / {{ media?.duration}}</p>-->

    <dot *ngFor="let item of newList; let $index = index"
         style="margin: .3rem; padding: .5rem;"
        (click)="onClickPlaylistItem(item, $index)"
        [class.selected]="item === currentItem">
      
      <p class="node"> <span style="font-family: sans-serif">&#8470;</span> {{ $index+1 }}</p>

    </dot>
    <dot style="margin: .3rem; padding: .5rem;" (click)="nextVideo()"><p class="node">&#8594;</p></dot>
    <dot style="margin: .3rem; padding: .5rem;" routerLink="setup"><p class="node">&#x2609;</p></dot>
    <div class="nodes">
      <dot style="margin: .3rem; padding: .5rem;" (click)="reset()"><p class="node">reset</p></dot>
      <dot style="margin: .3rem; padding: .5rem;" (click)="play()"><p class="node">play</p><i class="icon-control-play icons"></i></dot>
      <dot style="margin: .3rem; padding: .5rem;" (click)="end()"><p class="node">end</p></dot>
      <dot style="margin: .3rem; padding: .5rem;" (click)="pause()"><p class="node">pause</p></dot>

      <dot style="margin: .3rem; padding: .5rem;" (click)="forward()"><p class="node">forward</p></dot>

     <dot style="margin: .3rem; padding: .5rem;" (click)="backward()"><p class="node"> backward</p></dot>


    </div>
  </ul>`,
  styleUrls: ['inter.player.sass'],

})
export class SmartPlaylistComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('masterRef') masterRef: ElementRef;

  @Input() dev;

  @Input() autoplay: boolean = false;

  @Input()newList: Array<IMedia> = []

  @Output() playerReady = new EventEmitter();

  currentIndex = 0;
  api: VgAPI;

  media;

  constructor(private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.masterRef.nativeElement.pause()
  }

  ngAfterViewInit() {
    this.masterRef.nativeElement.pause()
  }

  ngOnChanges() {
    // console.log('changes!!!!!')
    // if (this.api !== null) this.media = this.api.getDefaultMedia();
    // console.log('changes!!!!!', this.media)
    this.cd.detectChanges();
  }

  get currentItem(): IMedia {
    return this.newList[ this.currentIndex ];
  }
  //
  // onPlayerReady(api: VgAPI) {
  //   this.api = api;
  //
  //   this.media = this.api.getDefaultMedia();
  //
  //   this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.playVideo.bind(this));
  //   this.api.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
  // }

  onPlayerReady(api: VgAPI) {

    this.media = api.getDefaultMedia();
    

    this.api = api;
    this.api.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));

    // this.setTime(60);

    this.playerReady.emit(api);

    // setTimeout(() => {
    //   this.playAfter(api);
    // }, 10000);
    //

    // console.log(this.media, this.api);
  }

  nextVideo() {
    this.currentIndex++;

    if (this.currentIndex === this.newList.length) {
      this.currentIndex = 0;
    }
  }

  playVideo() {
    this.api.play();
  }

  play() {
    this.api.play();
  }
  pause() {
    this.api.pause();
  }

  reset() {
    this.api.pause();
    this.api.seekTime(0);
  }
  end() {
    this.api.pause();
    this.api.seekTime(100, true);
  }

  onClickPlaylistItem(item: IMedia, index: number) {
    this.currentIndex = index;
  }

  forward(){
    console.log('forward');
    let currentTime = this.api.currentTime ;
    this.api.currentTime = currentTime + 2;
  }

  backward(){
    console.log('backward');
    let currentTime = this.api.currentTime ;
    this.api.currentTime = currentTime - 2;
  }
}
