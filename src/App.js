import React, { useEffect, useState } from 'react';

import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import './App.css';

const SITE_KEY = "put site key here";

function App() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  useEffect(() => {
    const loadScriptByURL = (id, url, callback) => {
      const isScriptExist = document.getElementById(id);

      if (!isScriptExist) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = id;
        script.onload = function () {
          if (callback) callback();
        };
        document.body.appendChild(script);
      }

      if (isScriptExist && callback) callback();
    }

    // load the script by passing the URL
    loadScriptByURL("recaptcha-key", `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`, function () {
      console.log("Script loaded!");
    });
  }, []);

  const handleOnClick = e => {
    e.preventDefault();
    setLoading(true);
    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(SITE_KEY, { action: 'submit' }).then(token => {
        submitData(token);
      });
    });
  }

  const submitData = token => {
    // call a backend API to verify reCAPTCHA response
    fetch('http://localhost:4000/verify', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "name": name,
        "email": email,
        "g-recaptcha-response": token
      })
    }).then(res => res.json()).then(res => {
      setLoading(false);
      setResponse(res);
    });
  }

  return (
    <Container className="p-3">
      <Form>
      <h3>reCAPTCHA v3 in React with Express for backend</h3>
      <Form.Label>Nom</Form.Label>
      <Form.Control type="name" placeholder="Entrez le nom" onChange={e => setName(e.target.value)} value={name} />

      <Form.Label>Courriel</Form.Label>
      <Form.Control type="name" placeholder="Entrez le courriel" onChange={e => setEmail(e.target.value)} value={email} />

      <Button onClick={handleOnClick} disabled={loading} variant="primary">{loading ? 'en cours...' : 'Soumettre'}</Button>{' '}
      <br /><br />
      {response && <label>Output:<br /><pre>{JSON.stringify(response, undefined, 2)}</pre></label>}
      </Form>
    </Container>
  );
}

export default App;