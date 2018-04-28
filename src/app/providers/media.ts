import {Injectable, NgZone} from '@angular/core'
import {ElectronService} from 'ngx-electron'
import {FsService} from 'ngx-fs'

import * as fs from 'fs'

import {IMedia} from '../components/inter.player'

@Injectable()
export class MediaService {
  constructor(private electron: ElectronService) {
  }

  getPlayPath(): String {
    const { remote } = this.electron;
    const playPath = remote.getGlobal('playPath') || {};
    const { name } = remote.getCurrentWindow() as any;

    return playPath[name] || '';
  }

  getVideos(): Array<IMedia> {
    const fs = this.electron.remote.require('fs');
    const ext = '.mp4';
    const playPath = this.getPlayPath();
  
    if (!playPath) {
      return [];
    }

    const x = fs.readdirSync(playPath);

    const files: Array<IMedia> = [];
    x.forEach(f => {
      if (f.endsWith(ext)) {
        files.push({
          src: `file://${playPath}/${f}`,
        });
      }
    });

    return files;
  }
}
