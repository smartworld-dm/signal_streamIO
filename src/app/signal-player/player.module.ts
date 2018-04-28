import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SignalEvents } from './core/events/vg-events'
import { VgBufferingModule } from './buffering/buffering'
import { VgCoreModule } from './core/core'
import { VgControlsModule } from './controls/controls'
import { VgOverlayPlayModule } from './overlay-play/overlay-play'
import { VgStreamingModule } from './streaming/streaming'

export function playerModules() {
 return [CommonModule, VgCoreModule, VgControlsModule, VgOverlayPlayModule, VgStreamingModule, VgBufferingModule]
}

export function playerProviders() {
 return [
  // SignalEvents
 ]
}

@NgModule({
 imports: playerModules(),
 providers: playerProviders()
})
export class PlayerModule {}
