import {Component, NgZone, OnInit} from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {Router} from '@angular/router';
import {VgAPI} from '../signal-player/core/services/vg-api'
import {SignalService} from '../providers/signal'
import {FsService} from 'ngx-fs'
import {IMedia, SmartPlaylistComponent} from '../components/inter.player'
import {MediaService} from '../providers/media'
import {Hotkey, HotkeysService} from '../hotkeys';


export interface INode {
  id: number;
  src: string;
  poster: string;
  position: string;
}

@Component({
  selector: 'intercept',
  template: ` 
    <smart-playlist #player [dev]="isDev()" [newList]="playlist" [autoplay]="autoplay"
                    (playerReady)="getVideoApi($event)"></smart-playlist>
  `,
  styleUrls: ['intercept.sass'],
})
export class InterceptComponent implements OnInit {


  msg: any;
  status;
  media;
  dev = false;
  number = 0;

  api: VgAPI;

  autoplay = false;

  count = 0;
  start = 0;
  time = 0;
  elapsed = '0.0';
  playlist: Array<IMedia> = [];

  constructor(
    private _ngZone: NgZone,
    private _router: Router,
    private signal: SignalService,
    private _hotkeysService: HotkeysService,
    private electron: ElectronService,
    private mediaService: MediaService,
    private efs: FsService
  ) {
     this.number = Math.floor((Math.random() * 100) + 1);
     //console.log(Math.floor((Math.random() * 100) + 1));
  }

  ngOnInit() {
    if (!this.mediaService.getPlayPath()) {
      this.goToSetup();
    }

    this.playlist = this.mediaService.getVideos();

    console.log(this.playlist)
    this.signal.getMessage().subscribe(msg => {
      this.msg = '1st ' + msg;
    });

    console.log( ' ------------ Window ----------' + window);

    // HOTKEYS!!!

    this.start = new Date().getTime(),
    this.time = 0,
    this.elapsed = '0.0';


    this._hotkeysService.add(
      new Hotkey(['command+q', 'ctrl+q'], (event: KeyboardEvent): boolean => {
        console.log('relaunch');
        this.electron.remote.app.quit();
        return false; // Prevent bubbling
      }, undefined, 'Quit App')
    );

    this._hotkeysService.add(
      new Hotkey(['command+r', 'ctrl+r'], (event: KeyboardEvent): boolean => {
        console.log('relaunch');
        this.electron.remote.app.relaunch();
        return false; // Prevent bubbling
      }, undefined, 'Relaunch App')
    );

    this._hotkeysService.add(
      new Hotkey('shift+z', (event: KeyboardEvent): boolean => {
        console.log('toggled dev');
        this.dev = !this.dev;
        return false; // Prevent bubbling
      }, undefined, 'Toggle Meta Data')
    );


    this._hotkeysService.add(
      new Hotkey('shift+s', (event: KeyboardEvent): boolean => {
        console.log('go to setup');
        this.goToSetup();
        return false;
      }, undefined, 'Configure Setup'));


    this._hotkeysService.add(
      new Hotkey('space', (event: KeyboardEvent): boolean => {
        console.log('toggle play');
        this.togglePlay();
        return false;
      }, undefined, 'Toggle Play'));

    this.signal.getReport().subscribe(message=> {
      console.log('report');
      console.log(message);
      let report_timestamp = message['timestamp'];
      this.signal.sendReportTime({
        number:this.number,
        report_timestamp:report_timestamp,
        position: this.api.currentTime,
        current_timestamp:Date.now()
      });
    });

    this.signal.getAdjust().subscribe(message=>{
      var interleave_time = (Date.now()-message['update_timestamp'])/1000;
      var standard_position = message['position'];
      var new_position = standard_position + interleave_time;

      console.log('new_position=' + new_position);
      console.log('current_position=' + this.api.currentTime);
      console.log('current playback rate=' + this.api.playbackRate);
      if(new_position - 0.2> this.api.currentTime) {
        this.api.playbackRate = 1.1;
      }
      else if(new_position + 0.2<this.api.currentTime) {
        this.api.playbackRate = 0.9;
      }
      else {
        this.api.playbackRate = 1;
      }
    });


    this.signal.getStatus().subscribe(message => {
      // console.log('status is: ' + status)

      this.status = message['signal'];

      console.log(Date.now());
      console.log(this.api.currentTime);

      this.msg = message;

      console.log(this.api);
      /*this.api.subscriptions.play.subscribe(()=>{
        console.log('start palying');
      });*/

      console.log(this.api);
      this.api.subscriptions.play.subscribe(this.onPlayStart);
      this.api.subscriptions.pause.subscribe(this.onPaused);
      this.api.subscriptions.progress.subscribe(this.onProgress);


      this.api.subscriptions.waiting.subscribe(()=>{
        console.log('---------Waiting----------');
      });

      this.api.subscriptions.playing.subscribe(()=> {
        console.log('playing');
        console.log(this.api.currentTime);
      });

    this.api.subscriptions.seeking.subscribe(()=> {
        console.log('seeking');
      });

    this.api.subscriptions.suspend.subscribe(()=> {
        console.log('suspend');
      });

    this.api.subscriptions.loadStart.subscribe(()=> {
        console.log('loadStart');
      });

    this.api.subscriptions.loadedData.subscribe(()=> {
        console.log('loadedData');
      });

    this.api.subscriptions.timeUpdate.subscribe(()=> {
      });

      if (this.status === 'play') {
        console.log('pause start');
        this.togglePlay()
      }
      if (this.status === 'pause') {
      console.log('play start');
        this.count = 0;
        this.togglePlay()
      }
      if (status === 'reset') {
        this.media.seekTime(0);
      }
    });

    window.setTimeout(this.instance, 1000);


  setInterval(() => {
      if(this.media.state==='playing') {
      this.count +=1;
      /*console.log({
        count:this.count,
        no:this.number,
        currentTime:this.api.currentTime,
        duration:this.api.duration
        });*/
       /*this.signal.sendLog({
        no:this.number,
        currentTime:this.api.currentTime,
        duration:this.api.duration
        });*/
      }
    }, 100);
  }

  onPaused = () => {
    console.log('onPause');
    console.log(Date.now());
    console.log(this.api.currentTime);
  }

  onProgress = () => {
  console.log('onProgress');
  }

  onPlayStart = () => {
    /*console.log('onPlayStart');
    console.log(Date.now());

    console.log(this.msg.timestamp);
    var difference = Date.now()- this.msg.timestamp;

    var forward_pos = (100-difference) / 1000; 

    console.log('difference = ' + (100 - difference));
    console.log(forward_pos);

    this.api.currentTime += forward_pos;
    console.log(this.api.currentTime);*/
  }

  getVideoApi(api: VgAPI) {
    console.log('why not us');
    this.api = api;
    this.media = api.getDefaultMedia();
  }

  togglePlay() {
    this.autoplay = true;
    this.signal.sendLog('currentTime =' + this.api.currentTime);

    this.media.state === 'paused' ? this.api.play() : this.api.pause();
  }


  toggleTest() {
    console.log(this.media)
  }

  play() {
    this.media.play();
  }

  pause() {
    this.media.pause();
  }

  reset() {
    this.media.pause();
    this.media.seekTime(0);
  }

  end() {
    this.media.pause();
    this.media.seekTime(100, true);
  }

  goToSetup() {
    this._router.navigate(['setup']);
  }

  isDev() {
    return this.dev;
  }

  instance = () =>{
    /*this.time += 1000;

    this.elapsed = (Math.floor(this.time / 1000) / 10)).toString();
    if(Math.round(this.elapsed) == this.elapsed) 
    { this.elapsed += this.elapsed '.0'; }

     if(this.media.state==='playing') {
      this.count +=1;
    }
    var diff = new Date().getTime() - this.time;
    console.log(this.api.currentTime);
    window.setTimeout(this.instance, (1000 - diff));*/
  }
}
