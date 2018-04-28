import {Component, OnInit} from '@angular/core'
import { Router } from '@angular/router';
import { ElectronService } from 'ngx-electron';
import {MediaService} from '../../providers/media'
import {Hotkey, HotkeysService} from "../../hotkeys";

@Component({
  selector: 'app-setup',
  template: `    
    <div id="home" class="container">
      <div class="content">

        <div class="open-container">
          <div class="button no-drag"><img class="logo" style="margin: auto; display: flex; width: 50%;" src="assets/logo.svg" alt=""></div>
          <div class="legal">This proprietary software is <br> the intellectual property of Framework New York <br> and is licenced to Levels.
          </div>
        </div>

        <div class="default-client-container">
          <dot style="display:grid;" >
            <div class="button no-drag" (click)="setPath()">Link S10NAL</div>
          </dot>
          <dot *ngIf="isSet" style="display:grid;" >
            <div class="button no-drag" routerLink="/">Play S10NAL</div>
          </dot>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./setup.component.sass']
})
export class SetupComponent implements OnInit {

  isSet = false;
  constructor(
    private _router: Router,
    private mediaService: MediaService,
    private _hotkeysService: HotkeysService,
    private _electronService: ElectronService,
  ) {
  }
  ngOnInit() {
    if (this.mediaService.getPlayPath()) {
      this.isSet = true;
      // this.goToSetup();
    }

    // this._hotkeysService.add(
    //   new Hotkey('shift+a', (event: KeyboardEvent): boolean => {
    //     console.log('switching to video');
    //     this.goToPlay();
    //     return false; // Prevent bubbling
    //   }, undefined, 'Go To Media')
    // );
  }

  setPath() {
    const { _electronService } = this;

    if (_electronService.isElectronApp) {
      const folders = _electronService.remote.dialog.showOpenDialog({ properties: ['openDirectory'] });

      if (folders) {
        const windowName =  (_electronService.remote.getCurrentWindow() as any).name;
        _electronService.ipcRenderer.send('save-path', folders[0], windowName);
        this.goToPlay();
      }
    }
  }

  goToPlay() {
    this._router.navigate(['']);
  }
}
