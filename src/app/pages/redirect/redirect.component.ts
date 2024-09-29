import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  //   // Detect the device type
  //   const userAgent = navigator.userAgent;

  //   if (this.isMobileDevice(userAgent)) {
  //     this.redirectToAppStore(userAgent);
  //   } else {
  //     // Redirect to the main URL if not a mobile device
  //     window.location.href = 'https://podqasti.com/#/ar/home';
  //   }
  // }

  // isMobileDevice(userAgent: string): boolean {
  //   return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  // }

  // redirectToAppStore(userAgent: string): void {
  //   // Redirection logic for mobile devices
  //   if (/android/i.test(userAgent)) {
  //     window.location.href = 'https://play.google.com/store/apps/details?id=com.podcasti';
  //   } else if (/iPad|iPhone|iPod/.test(userAgent)) {
  //     window.location.href = 'https://apps.apple.com/us/app/podqasti/id1565352601';
  //   }
  }

}
