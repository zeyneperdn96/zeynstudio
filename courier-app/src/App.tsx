import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './layouts/AppShell';
import { Login } from './pages/auth/Login';
import { OTPVerification } from './pages/auth/OTPVerification';
import { Splash } from './pages/auth/Splash';
import { CourierProfile } from './pages/onboarding/CourierProfile';
import { Documents } from './pages/onboarding/Documents';
import { ApprovalPending } from './pages/onboarding/ApprovalPending';
import { Home } from './pages/main/Home';
import { Tasks } from './pages/main/Tasks';
import { TaskDetail } from './pages/main/TaskDetail';
import { Earnings } from './pages/account/Earnings';
import { Profile } from './pages/account/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/otp" element={<OTPVerification />} />

        <Route path="/onboarding/profile" element={<CourierProfile />} />
        <Route path="/onboarding/documents" element={<Documents />} />
        <Route path="/onboarding/pending" element={<ApprovalPending />} />

        <Route element={<AppShell />}>
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
