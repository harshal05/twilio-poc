import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TwilioService } from '../twilio.service';

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.scss'],
})
export class LiveChatComponent implements OnInit, AfterViewInit {
  @ViewChild('localVideo') localVideo: ElementRef | any;
  @ViewChild('remoteVideo') remoteVideo: ElementRef | any;
  room_name: string = 'test';
  access_tokan: any ='';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public twilioService: TwilioService
  ) {
    const navLength = navigator.vendor.match(/[Aa]+pple/g)?.length ?? 0;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(function (stream) {})
        .catch((error) => {
          console.log(error.name + ':' + error.message);
        });
    } else if (navLength > 0)
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: true })
        .then(() => {})
        .catch((error) => {
          console.log(error.name + ':' + error.message);
        });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.twilioService.localVideo = this.localVideo;
    this.twilioService.remoteVideo = this.remoteVideo;
  }

  disconnect() {
    if (this.twilioService.roomObj && this.twilioService.roomObj !== null) {
      this.twilioService.roomObj.disconnect();
      this.twilioService.previewing = false;
      this.twilioService.roomObj = null;
    } else console.log('thanks');
  }

  connect() {
    let accessToken = this.access_tokan;
    this.twilioService.connectToRoom(accessToken, {
      name: this.room_name,
      audio: true,
      video: { height: 720, frameRate: 24, width: 1280 },
      bandwidthProfile: {
        video: {
          mode: 'collaboration',
          maxTracks: 10,
          dominantSpeakerPriority: 'standard',
          // renderDimensions: {
          //   high: { height: 1080, width: 1980 },
          //   standard: { height: 720, width: 1280 },
          //   low: { height: 176, width: 144 },
          // },
          contentPreferencesMode: 'manual',
        },
      },
    });
  }
  mute() {
    this.twilioService.mute();
  }

  unmute() {
    this.twilioService.unmute();
  }
  ngOnDestroy() {
    this.disconnect();
  }
}
