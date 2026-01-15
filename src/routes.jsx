import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'livros',
        element: <Books />,
      },
      {
        path: 'livros/:id',
        element: <BookDetail />,
      },
      {
        path: 'adicionar',
        element: <AddBook />,
      },
      {
        path: 'editar/:id',
        element: <EditBook />,
      },
      {
        path: 'buscar',
        element: <Books />,
      },
    ],
  },
]);

export default router;