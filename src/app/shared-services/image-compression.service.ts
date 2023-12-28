import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {NgxImageCompressService} from "ngx-image-compress";

@Injectable({
  providedIn: 'root'
})
export class ImageCompressionService {

  constructor(@Inject(PLATFORM_ID) private platformId: object, private imageCompress: NgxImageCompressService) { }

  compressFile(image, fileName) {
    return new Promise((resolve, reject) => {
      var orientation = -1;
      const sizeOfOriginalImage = this.imageCompress.byteCount(image) / (1024 * 1024);
      console.log('Image Original Size', sizeOfOriginalImage);
      this.imageCompress.compressFile(image, orientation, 50, 50).then(
          result => {
            const imgResultAfterCompress = result;
            const base64 = result;
            const sizeOFCompressedImage = this.imageCompress.byteCount(result) / (1024 * 1024);
            console.log('Size in bytes after compression:', sizeOFCompressedImage);
            const imageName = fileName;
            const imageBlob = this.dataURItoBlob(imgResultAfterCompress.split(',')[1]);
            const imageFile = new File([imageBlob], imageName, { type: 'image/png' });

            const compressedImageData = {
              imageFile: imageFile,
              base64: base64
            };

            resolve(compressedImageData);
          }
      ).catch(error => {
        reject(error);
      });
    });
  }

  dataURItoBlob(dataURI) {
    let byteString = null;
    if (isPlatformBrowser(this.platformId) && typeof window !== 'undefined') {
      byteString = window.atob(dataURI);
    }
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }
}
