import { Component } from '@angular/core'
import { ElectronService } from './providers/electron.service'
import { AppConfig } from './app.config'

@Component({
  selector: 'app-root',
  template: `
    <hotkeys-cheatsheet></hotkeys-cheatsheet>

    <router-outlet></router-outlet>`,
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  constructor(public electronService: ElectronService) {
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron()) {
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }
}
