import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

//validator for MIME type of file to make sure its an image file
export const mimeType = (control: AbstractControl): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> => {
  if (typeof(control.value) === 'string'){
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();

  //creating my own observable for file reader
  const frObs = Observable.create(
    (observer: Observer<{[key: string]: any}>) => {
    fileReader.addEventListener("loadend", () => {
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4); //array of 8bit unsigned integers - allows us to read certain patterns in file/ file's metadata
      let header = "";
      let isValid = false;
      for (let i = 0; i < arr.length; i++){
            header+= arr[i].toString(16); //convert to hexadecimal
      }
      switch (header){ //hex patterns which stand for different file types
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false;
          break;
      }
      if (isValid){
        observer.next(null);
      } else {
        observer.next({ invalidMimeType: true});
      }
      observer.complete();
    });
    fileReader.readAsArrayBuffer(file);
  });
  return frObs;
};
