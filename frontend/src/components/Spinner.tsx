import { LoaderCircle } from 'lucide-preact'; // o 'lucide-react' si usas React
import './Spinner.css';

export default function Spinner() {
  return (
    <div className="spinner-container">
      <LoaderCircle className="spinner-rotate" />
    </div>
  );
}
