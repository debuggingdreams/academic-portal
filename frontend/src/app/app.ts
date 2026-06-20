import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Removed LoginComponent from here since RouterOutlet handles it now!
  templateUrl: './app.html',      
  styleUrls: ['./app.css']        
})
export class App {
  // This class must be named 'App' to fix your main.server.ts error
}