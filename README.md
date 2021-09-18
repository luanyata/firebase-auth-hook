<img alt="GoStack" src="./images/fire-hook.jpeg" />

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/luanyata/firebase-auth-hook?color=%2304D361">

  <a href="https://www.linkedin.com/in/luanyata/">
    <img alt="Made by Luan Yata" src="https://img.shields.io/badge/made%20by-LuanYata-%2304D361">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361">

  <a href="https://github.com/luanyata/firebase-auth-hook/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/luanyata/firebase-auth-hook?style=social">
  </a>
</p>

## Sobre:

Hook simples para realizar login / logout usando o [Firebase Auth](https://firebase.google.com/docs/auth/web/start).

## Dependencias:
  *  [firebase](https://www.npmjs.com/package/firebase)
  *  [axios](https://www.npmjs.com/package/axios)


## Importante:

* O hook leva em consideração que toda as configurações de comunicação com o firebase estão realizadas.
* Caso não conheca como ***CONTEXT API*** recomendo a [leitura](https://reactjs.org/docs/context.html).


## Recursos:

* Login social com o Google:    
* Login social com o Facebook
* Login utilizando Usuário/Senha
* Logout
* Objeto user contendo dados do usuário: Nome, Email, Avatar, etc...


```tsx
import {useAuth} from 'PATH/auth'
//...
const { signInEmailAndPassword, signInFacebook, signInGoogle, logout, user } = useAuth();
```