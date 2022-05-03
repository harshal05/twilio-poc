import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { connect } from 'twilio-video';

@Injectable({
  providedIn: 'root',
})
export class TwilioService {
  public remoteVideo: ElementRef | any;
  public localVideo: ElementRef | any;
  previewing: boolean | undefined;
  msgSubject = new BehaviorSubject('');
  roomObj: any;
  microphone = true;
  roomParticipants: any;
  private renderer: Renderer2;
  constructor(
    // private http: Http,
    private router: Router,
    private rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // getToken(): Observable<any> {
  //   return this.http.post('/abc', { uid: ‘ashish’ });
  //   }

  // connectToRoom(accessToken: string, options: any): void {
  //   connect(accessToken, options).then(
  //     (room) => {},
  //     (error) => {
  //       alert(error.message);
  //     }
  //   );
  // }

  mute() {
    this.roomObj?.localParticipant.audioTracks.forEach((audioTrack: any) => {
      audioTrack.track.disable();
    });
    this.microphone = false;
  }

  unmute() {
    this.roomObj?.localParticipant.audioTracks.forEach((audioTrack: any) => {
      audioTrack.track.enable();
    });
    this.microphone = true;
  }

  connectToRoom(accessToken: string, options: any) {
    connect(accessToken, options).then(
      (room) => {
        this.roomObj = room;
        if (!this.previewing && options['video']) {
          this.startLocalVideo();
          this.previewing = true;
        }
        this.roomParticipants = room.participants;
        room.participants.forEach((participant) => {
          this.attachParticipantTracks(participant);
        });
        room.on('participantDisconnected', (participant) => {
          this.detachTracks(participant);
        });
        room.on('participantConnected', (participant) => {
          this.roomParticipants = room.participants;
          this.attachParticipantTracks(participant);
          participant.on('trackPublished', (track: any) => {
            const element = track.attach();
            this.renderer.data['id'] = track.sid;
            this.renderer.setStyle(element, 'height', '100%');
            this.renderer.setStyle(element, 'max-width', '100%');
            this.renderer.appendChild(this.remoteVideo.nativeElement, element);
          });
        });
        // When a Participant adds a Track, attach it to the DOM.
        room.on('trackPublished', (track, participant) => {
          this.attachTracks([track]);
        });
        // When a Participant removes a Track, detach it from the DOM.
        room.on('trackUnsubscribed', (track: any, participant: any) => {
          this.detachTracks([track]);
        });
        room.once('disconnected', (room) => {
          room.localParticipant.tracks.forEach((track: any) => {
            track.track.stop();
            const attachedElements = track.track.detach();
            attachedElements.forEach((element: any) => element.remove());
            room.localParticipant.videoTracks.forEach((video: any) => {
              const trackConst = [video][0].track;
              trackConst.stop(); // <- error
              trackConst.detach().forEach((element: any) => element.remove());
              room.localParticipant.unpublishTrack(trackConst);
            });
            let element = this.remoteVideo.nativeElement;
            while (element.firstChild) {
              element.removeChild(element.firstChild);
            }
            let localElement = this.localVideo.nativeElement;
            while (localElement.firstChild) {
              localElement.removeChild(localElement.firstChild);
            }
            // this.router.navigate([‘thanks’]);
          });
        });
      },
      (error) => {
        alert(error.message);
      }
    );
  }

  attachParticipantTracks(participant: any): void {
    participant.tracks.forEach((part: any) => {
      this.trackPublished(part);
    });
  }

  trackPublished(publication: any) {
    if (publication.isSubscribed) this.attachTracks(publication.track);
    if (!publication.isSubscribed)
      publication.on('subscribed', (track: any) => {
        this.attachTracks(track);
      });
  }

  attachTracks(tracks: any) {
    const element = tracks.attach();
    this.renderer.data['id'] = tracks.sid;
    this.renderer.setStyle(element, 'height', '100%');
    this.renderer.setStyle(element, 'max-width', '100%');
    this.renderer.appendChild(this.remoteVideo.nativeElement, element);
  }

  startLocalVideo(): void {
    this.roomObj.localParticipant.videoTracks.forEach((publication: any) => {
      const element = publication.track.attach();
      this.renderer.data['id'] = publication.track.sid;
      this.renderer.setStyle(element, 'width', '25%');
      this.renderer.appendChild(this.localVideo.nativeElement, element);
    });
  }

  detachTracks(tracks: any): void {
    tracks.forEach((track: any) => {
      let element = this.remoteVideo.nativeElement;
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
    });
  }
}
