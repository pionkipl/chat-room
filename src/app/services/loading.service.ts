import { Subject } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LoadingService {
  isLoading: Subject<boolean> = new Subject();
  constructor() {}
}
