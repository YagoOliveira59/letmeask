import { BrowserRouter, Route, Switch } from 'react-router-dom'

import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

import { AuthContextProvider } from './contexts/AuthContext'
import { Room } from './pages/Room';
import { CreatorRoom } from './pages/CreatorRoom';

import './styles/global.scss'

function App() {

  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/rooms/:id" component={Room} />

          <Route path="/creator/rooms/new" exact component={NewRoom} />
          <Route path="/creator/rooms/:id" component={CreatorRoom} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;