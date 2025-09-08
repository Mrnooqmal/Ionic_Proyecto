import { Component } from "@angular/core";
import { IonContent, IonHeader, IonItem, IonLabel, IonTitle, IonToolbar, IonText , IonSelect, IonSelectOption, IonButton} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: "app-anime",
  templateUrl: "./anime.page.html",
  styleUrls: ["./anime.page.scss"],
  standalone: true,
  imports: [
    RouterModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonLabel,
    IonText,
    IonButton,

  ] 
})
export class AnimePage {
    animes: string[] = [
        "Naruto",
        "One Piece",
        "Attack on Titan",
        "Demon Slayer"
    ];

    resultado: string | null = null;

    ObtenerAnime() {
        const random = Math.floor(Math.random() * this.animes.length);
        this.resultado = this.animes[random];
    }

    mostrarFotoAnime(anime: string): string {
        switch(anime) {
            case 'Naruto':
                return 'assets/fotos_anime/naruto.jpg';
            case 'One Piece':
                return 'assets/fotos_anime/onepiece.jpg';
            case 'Attack on Titan':
                return 'assets/fotos_anime/attackontitan.jpg';
            case 'Demon Slayer':
                return 'assets/fotos_anime/demonslayer.jpg';
            default:
                return '';
        }
    }
}
