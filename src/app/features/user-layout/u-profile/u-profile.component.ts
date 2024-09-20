import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-u-profile',
  templateUrl: './u-profile.component.html',
  styleUrls: ['./u-profile.component.css'],
  standalone: true,
  imports: [HeaderComponent]
})
export class UProfileComponent {
  user = {
    name: 'John Doe',
    email: 'johndoe@example.com',
    profilePhotoUrl: 'https://via.placeholder.com/150'
  };

  onChangeProfilePhoto(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Logic to upload the photo and update the profile photo URL
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.profilePhotoUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onChangePassword(): void {
    // Logic to change the user's password
    alert('Password change functionality will be implemented here.');
  }
}