import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ApiService } from 'src/app/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorProcessingService } from 'src/app/services/error-processing.service';
import { LocaleService } from 'src/app/services/locale.service';
import { Locale, Response, User } from 'src/app/types';

export interface MediaRecorderErrorEventInit extends EventInit {
    error: DOMException;
}

export declare class MediaRecorderErrorEvent extends Event {
    constructor(type: string, eventInitDict: MediaRecorderErrorEventInit);
    readonly error: DOMException;
}

export interface BlobEventInit extends EventInit {
    data: Blob;
    timecode?: number;
}

export declare class BlobEvent extends Event {
    constructor(type: string, eventInitDict: BlobEventInit);
    readonly data: Blob;
    readonly timecode: number;
}

export type BitrateMode = 'vbr' | 'cbr';

export interface MediaRecorderOptions {
    mimeType?: string;
    audioBitsPerSecond?: number;
    videoBitsPerSecond?: number;
    bitsPerSecond?: number;
    audioBitrateMode?: BitrateMode;
}

export type RecordingState = 'inactive' | 'recording' | 'paused';

export interface MediaRecorderEventMap {
    "dataavailable": BlobEvent;
    "error": MediaRecorderErrorEvent;
    "pause": Event;
    "resume": Event;
    "start": Event;
    "stop": Event;
}

export declare class MediaRecorder extends EventTarget {
    readonly stream: MediaStream;
    readonly mimeType: string;
    readonly state: RecordingState;
    readonly videoBitsPerSecond: number;
    readonly audioBitsPerSecond: number;
    readonly audioBitrateMode: BitrateMode;

    ondataavailable: ((event: BlobEvent) => void) | null;
    onerror: ((event: MediaRecorderErrorEvent) => void) | null;
    onpause: EventListener | null;
    onresume: EventListener | null;
    onstart: EventListener | null;
    onstop: EventListener | null;

    constructor(stream: MediaStream, options?: MediaRecorderOptions);

    addEventListener<K extends keyof MediaRecorderEventMap>(type: K, listener: (this: MediaRecorder, ev: MediaRecorderEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof MediaRecorderEventMap>(type: K, listener: (this: MediaRecorder, ev: MediaRecorderEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

    start(timeslice?: number): void;
    stop(): void;
    resume(): void;
    pause(): void;
    requestData(): void;

    static isTypeSupported(type: string): boolean;
}

export interface Window {
    MediaRecorder: typeof MediaRecorder;
    BlobEvent: typeof BlobEvent;
    MediaRecorderErrorEvent: typeof MediaRecorderErrorEvent;
}

@Component({
	selector: 'app-recording',
	templateUrl: './recording.component.html',
	styleUrls: ['./recording.component.scss'],
	
})
export class RecordingComponent implements OnInit, OnDestroy
{
	private _unsubscribeAll: Subject<any>;

	public _devices 	   : MediaDeviceInfo[] | null;

	public _selectedDevice : MediaDeviceInfo   | null;

	public mediaRecorder   : MediaRecorder     | null;

	public recordedChunks  : any[]			   | null;

	public recordingState  : 'RECORDING' | 'STOPPED' | 'PAUSED' = 'STOPPED';

	public downloadingState: 'READY' | 'NOT_READY'		        = 'NOT_READY';

	public locale          : Locale | null = null;

	public form			   : FormGroup;

	public counterTimeout  : any = null;

	public counter         : number = 0;

	public counterToTime   : string = '00:00';

	constructor(
		private localeService   : LocaleService,
		private apiService      : ApiService,
		private errorProcessing : ErrorProcessingService,
		private authService     : AuthService,
		private formBuilder		: FormBuilder,
	)
	{

	}

	ngOnInit(): void
	{
		this._unsubscribeAll = new Subject();

		this.form = this.formBuilder.group({
            name	     : ['', Validators.required],
            email        : ['', Validators.required],
            device       : ['', Validators.required],
			message      : ['', Validators.required],
        });
		// this.form.disable();

		this.localeService.locale$
		.pipe(takeUntil(this._unsubscribeAll))
		.subscribe((locale: Locale) => {
			this.locale = locale;
		});

		navigator.mediaDevices.getUserMedia({
            audio : true,
            video : false,
        })
        .then((stream: MediaStream) => {
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                this._devices = devices.filter((d) => d.kind === 'audioinput');
				this.authService.user$
				.pipe(take(1))
				.subscribe((user: User) => {
					this.form.setValue({
						name	     : user.name,
						email        : user.email,
						message      : '',
						device       : this._devices[0].deviceId,
					})
					this.form.enable();
				})
            })
        })
	}

	ngOnDestroy() : void
    {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

	setSelectedDevice(event: any)
	{
		console.log(event.target.value);
		this._selectedDevice = this._devices.filter((d) => d.deviceId === event.target.value)[0];
	}

	startRecording()
	{
		if (! this._devices) {
			alert('allowe MIC access first');
			return;
		}
		if (! this._selectedDevice && this._devices.length > 0) {
			this._selectedDevice = this._devices[0];
		}
		navigator.mediaDevices.getUserMedia({
			audio : {
				deviceId : this._selectedDevice.deviceId,
			},
			video: false
		})
        .then((stream: MediaStream) => {
			this.destroyMediaEvents();
            this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/*' });
			this.hookNewEvents();
			this.mediaRecorder.start();
			this.recordingState = 'RECORDING';
			this.counterState();
        });
	}

	resumeRecording()
	{
		console.log(this.mediaRecorder.state);
		if (this.mediaRecorder.state != 'recording') {
			this.mediaRecorder.resume();
		}
	}

	stopRecording()
	{
		this.mediaRecorder.stop();
		this.counter 	   = 0;
		this.counterToTime = this.secondsToTime(this.counter)
		// if (this.mediaRecorder.state != 'recording') {
		// 	this.mediaRecorder.resume();
		// 	this.mediaRecorder.stop();
		// }
		// if (this.mediaRecorder.state == 'recording') {
		// 	this.mediaRecorder.stop();
		// }
	}

	pauseRecording()
	{
		if (this.mediaRecorder.state == 'recording') {
			this.mediaRecorder.pause();
		}
	}

	secondsToTime(e: number){
		var h = Math.floor(e / 3600).toString().padStart(2,'0'),
			m = Math.floor(e % 3600 / 60).toString().padStart(2,'0'),
			s = Math.floor(e % 60).toString().padStart(2,'0');
		return m + ':' + s;
	}

	hasRemaningTime(counter: number)
	{
		if (counter / 60 >= 2) {
			return false;
		}
		return true;
	}

	counterState(force: boolean = false)
	{
		if (this.counterTimeout && !force) {
			return;
		}
		if (this.mediaRecorder.state == 'recording') {
			this.counter++;
			this.counterToTime = this.secondsToTime(this.counter)
			if (! this.hasRemaningTime(this.counter)) {
				this.stopRecording();
			}
		}
		this.counterTimeout = setTimeout(() => {
			this.counterState(true);
		}, 1000);
	}

	blobToFile(): File
	{
		let _blob = new Blob(this.recordedChunks);
		return new File([_blob], new Date + '.wav', {
			type: _blob.type,
		});
	}

	hookNewEvents()
	{
		this.recordedChunks = [];

		this.mediaRecorder.addEventListener('dataavailable', (e) => {
			if (e.data.size > 0) this.recordedChunks.push(e.data);
		});

		this.mediaRecorder.addEventListener('stop', () => {
			this.recordingState = 'STOPPED';
			let downloadLink  = document.getElementById('download');
			downloadLink.setAttribute('href', URL.createObjectURL(new Blob(this.recordedChunks)));
			downloadLink.setAttribute('download', new Date + '.wav');
			this.downloadingState = 'READY';
		});

		this.mediaRecorder.addEventListener('pause', () => {
			this.recordingState = 'PAUSED';
			let downloadLink  = document.getElementById('download');
			downloadLink.setAttribute('href', URL.createObjectURL(new Blob(this.recordedChunks)));
			downloadLink.setAttribute('download', new Date + '.wav');
			this.downloadingState = 'READY';
		});

		this.mediaRecorder.addEventListener('resume', () => {
			this.recordingState   = 'RECORDING';
			this.downloadingState = 'NOT_READY';
		});
	}

	destroyMediaEvents()
	{
		if (this.mediaRecorder) {
			this.mediaRecorder.removeEventListener('dataavailable', () => {})
			this.mediaRecorder.removeEventListener('start'		  , () => {})
			this.mediaRecorder.removeEventListener('stop'		  , () => {})
			this.downloadingState = 'NOT_READY';
		}
	}

	SendData()
	{
		this.form.disable();
		let formData = new FormData;
		formData.append("record_file", this.blobToFile());
		formData.append("name", this.form.value['name']);
		formData.append("email", this.form.value['email']);
		formData.append("message", this.form.value['message']);
		this.apiService.uploadRecording(this.locale.prefix, formData)
		.pipe(take(1))
		.subscribe((data: Response) => {
			let responseResult = this.errorProcessing.auto(data);
			if (responseResult) {

			}
			this.form.enable();
		});
	}
}
