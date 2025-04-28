import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
    const a=11;
    return <RouterProvider router={router} />;
}

export default App;
