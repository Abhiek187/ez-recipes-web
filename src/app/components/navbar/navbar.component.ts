import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private _isFavorite = false;
  heartIcon = 'favorite_border';

  get isFavorite(): boolean {
    return this._isFavorite;
  }

  set isFavorite(value: boolean) {
    // Update the material icon to match the corresponding boolean value
    this._isFavorite = value;
    this.heartIcon = this._isFavorite ? 'favorite' : 'favorite_border';
  }

  constructor() {}

  ngOnInit(): void {}

  toggleFavoriteRecipe() {
    // Placeholder for the heart button
    this.isFavorite = !this.isFavorite;
  }
}
