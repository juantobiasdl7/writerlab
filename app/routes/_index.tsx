import LandingPage from '~/components/home/LandingPage';
import { Link } from '@remix-run/react'

export default function Index() {
    return (
      <div className="bg-gray-900">
        <LandingPage/>
      </div>
    );
  }