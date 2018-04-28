import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { AppRouting } from './app.routing';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component'
import {SetupComponent} from './components/setup/setup.component'
import {PlayerModule} from './signal-player/player.module'
import {VgOverlayPlayModule} from './signal-player/overlay-play/overlay-play'
import {VgCoreModule} from './signal-player/core/core'
import {VgBufferingModule} from './signal-player/buffering/buffering'
import {VgControlsModule} from './signal-player/controls/controls'
import {InterceptComponent} from './containers/intercept'
import {SignalService} from './providers/signal'
import {NgxElectronModule} from 'ngx-electron'
import {SocketIoConfig, SocketIoModule} from 'ng-socket-io'
import {environment} from '../environments/environment.dev'
import {DotComponent} from './components/inter.node'
import {SmartPlaylistComponent} from './components/inter.player'
import {NgxFsModule} from 'ngx-fs'
import {MediaService} from './providers/media'
import {HotkeyModule} from './hotkeys';
const config: SocketIoConfig = { url: environment.socket.baseUrl, options: environment.socket.opts }


@NgModule({
  declarations: [
    AppComponent,
    WebviewDirective,
    SetupComponent,
    InterceptComponent,
    DotComponent,
    SmartPlaylistComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRouting,
    VgCoreModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgControlsModule,
    NgxElectronModule,
    PlayerModule,
    NgxFsModule,
    HotkeyModule.forRoot(),
    SocketIoModule.forRoot(config)
  ],
  providers: [ElectronService, SignalService, MediaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
