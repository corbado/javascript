import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <div id='sidebar'>
        <h1>Corbado Customized UI Samples</h1>
        <nav>
          <ul>
            <li>
              <Link to={`/`}>Sign Up</Link>
              <ul style={{ marginLeft: '20px' }}>
                <li>
                  <Link to={`/`}>Start</Link>
                </li>
                <li>
                  <Link to={`/passkey`}>Passkey</Link>
                </li>
                <li>
                  <Link to={`/passkey-benefits`}>Passkey Benefits</Link>
                </li>
                <li>
                  <Link to={`/passkey-success`}>Passkey Success</Link>
                </li>
                <li>
                  <Link to={`/passkey-error`}>Passkey Error</Link>
                </li>
                <li>
                  <Link to={`/email-otp`}>Email Otp</Link>
                </li>
                <li>
                  <Link to={`/passkey-prompt`}>Passkey Prompt</Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to={`/login`}>Login</Link>
              <ul style={{ marginLeft: '20px' }}>
                <li>
                  <Link to={`/`}>Start</Link>
                </li>
                <li>
                  <Link to={`/passkey-error`}>Passkey Error</Link>
                </li>
                <li>
                  <Link to={`/email-otp`}>Email Otp</Link>
                </li>
                <li>
                  <Link to={`/passkey-prompt`}>Passkey Prompt</Link>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      <div id='detail'>
        <Outlet />
      </div>
    </>
  );
}

export default App;
