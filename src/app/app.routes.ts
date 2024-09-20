import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from './core/services/auth-guard/auth.guard'; // Import the guard

import { AuthLayoutComponent } from './features/auth-layout/auth-layout.component';
import { UserLayoutComponent } from './features/user-layout/user-layout.component';
import { UDashboardComponent } from './features/user-layout/u-dashboard/u-dashboard.component';
import { AdminLayoutComponent } from './features/admin-layout/admin-layout.component';
import { ADashboardComponent } from './features/admin-layout/a-dashboard/a-dashboard.component';
import { UDocumentsComponent } from './features/user-layout/u-documents/u-documents.component';
import { UIncomingComponent } from './features/user-layout/u-incoming/u-incoming.component';
import { UReceivedComponent } from './features/user-layout/u-received/u-received.component';
import { UOutgoingComponent } from './features/user-layout/u-outgoing/u-outgoing.component';
import { UElogsComponent } from './features/user-layout/u-elogs/u-elogs.component';
import { ViewDetailsComponent } from './shared/components/view-details/view-details.component';
import { ADocumentsComponent } from './features/admin-layout/a-documents/a-documents.component';
import { AIncomingComponent } from './features/admin-layout/a-incoming/a-incoming.component';
import { AReceivedComponent } from './features/admin-layout/a-received/a-received.component';
import { AOutgoingComponent } from './features/admin-layout/a-outgoing/a-outgoing.component';
import { AlogsComponent } from './features/admin-layout/a-logs/a-logs.component';
import { UserManagementComponent } from './features/admin-layout/user-management/user-management.component';
import { AReportsComponent } from './features/admin-layout/a-reports/a-reports.component';
import { OfficeManagementComponent } from './features/admin-layout/office-management/office-management.component';
import { CatergoryManagementComponent } from './features/admin-layout/catergory-management/catergory-management.component';
import { UserDetailComponent } from './features/admin-layout/user-management/user-detail/user-detail.component';
import { OfficeEditComponent } from './features/admin-layout/office-management/office-edit/office-edit.component';
import { UCompletedComponent } from './features/user-layout/u-completed/u-completed.component';
import { CreateUserComponent } from './features/admin-layout/user-management/create-user/create-user.component';
import { ACompletedComponent } from './features/admin-layout/a-completed/a-completed.component';
import { AReceiveDocumentComponent } from './features/admin-layout/receive-document/receive-document.component';
import { AReceiveDocumentProceedComponent } from './features/admin-layout/receive-document/receive-document-proceed/receive-document-proceed.component';
import { AReleaseDocumentComponent } from './features/admin-layout/release-document/release-document.component';
import { AReleaseDocumentProceedComponent } from './features/admin-layout/release-document/release-document-proceed/release-document-proceed.component';
import { UReleaseDocumentProceedComponent } from './features/user-layout/release-document/release-document-proceed/release-document-proceed.component';
import { UReleaseDocumentComponent } from './features/user-layout/release-document/release-document.component';
import { UReceiveDocumentProceedComponent } from './features/user-layout/receive-document/receive-document-proceed/receive-document-proceed.component';
import { UReceiveDocumentComponent } from './features/user-layout/receive-document/receive-document.component';
import { UProfileComponent } from './features/user-layout/u-profile/u-profile.component';
import { AProfileComponent } from './features/admin-layout/a-profile/a-profile.component';
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
  },
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [AuthGuard], // Protect user layout
    data: { role: 'user' }, // Only allow users with 'user' role
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: UDashboardComponent },
      { path: 'documents', component: UDocumentsComponent },
      { path: 'incoming', component: UIncomingComponent },
      { path: 'received', component: UReceivedComponent },
      { path: 'outgoing', component: UOutgoingComponent },
      { path: 'completed', component: UCompletedComponent},
      { path: 'e-logs', component: UElogsComponent },
      { path: 'receive-document', component: UReceiveDocumentComponent },
      { path: 'receive-document-proceed/:documentCode', component: UReceiveDocumentProceedComponent },
      { path: 'release-document', component: UReleaseDocumentComponent },
      { path: 'release-document-proceed/:documentCode', component: UReleaseDocumentProceedComponent },
      { path: 'view-details/:documentCode', component: ViewDetailsComponent }, // Updated route with parameter
      { path: 'u-profile', component: UProfileComponent },    
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard], // Protect admin layout
    data: { role: 'admin' }, // Only allow users with 'admin' role
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ADashboardComponent },
      { path: 'a-documents', component: ADocumentsComponent },
      { path: 'a-incoming', component: AIncomingComponent },
      { path: 'a-received', component: AReceivedComponent },
      { path: 'a-outgoing', component: AOutgoingComponent },
      { path: 'a-completed', component: ACompletedComponent },
      { path: 'a-reports', component: AReportsComponent },
      { path: 'a-logs', component: AlogsComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'office-management', component: OfficeManagementComponent },
      { path: 'category-management', component: CatergoryManagementComponent },
      { path: 'user-detail/:id', component: UserDetailComponent },
      { path: 'office-edit/:id', component: OfficeEditComponent },
      { path: 'create-user', component: CreateUserComponent},
      { path: 'receive-document', component: AReceiveDocumentComponent },
      { path: 'receive-document-proceed/:documentCode', component: AReceiveDocumentProceedComponent },
      { path: 'release-document', component: AReleaseDocumentComponent },
      { path: 'release-document-proceed/:documentCode', component: AReleaseDocumentProceedComponent },
      { path: 'view-details/:documentCode', component: ViewDetailsComponent }, // Updated route with parameter
      { path: 'a-profile', component: AProfileComponent },    
    ],
  },
  {
    path: '**',
    redirectTo: '/login', // or a 404 page
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
