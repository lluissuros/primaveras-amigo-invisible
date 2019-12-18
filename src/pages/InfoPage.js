import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MoonLoader from "react-spinners/MoonLoader";
import { css } from "@emotion/core";
import styled from "styled-components";

import {
  Card,
  Logo,
  Form,
  Input,
  Button,
  Error,
  GradientBox
} from "../components/StyledComponents";
import Header from "../components/Header";
import { logout, getDecryptedUser, getUsers } from "../utils/AuthHelperMethods";
import { getConfessions, createConfession } from "../utils/api";

const overrideSpinner = css`
  display: block;
  margin: 90px auto;
  border-color: red;
`;

const TextArea = styled.textarea`
  background: transparent;
  min-height: 190px;
  min-width: 300px;
  font-size: 14px;
  padding: 12px;
  box-sizing: border-box;
`;

const HeaderPlaceholder = styled.div`
  height: 65px;
`;

const info = `
 (IN PROGRESS aqui aniria la info necessaria.)
 
Holi! benvingut a la app nadalenca de primaveras. 
Vindria a ser un homenatge al procés de descentralització comunicativa i desnormalització afectiva que ha anat permeant en el nostre estimat grup.
IMPORTANT: Tots els missatges son anonims, SEMPRE. 
Le caos ha arribat.

 *** FASE1: ESCRIURE CONFESSIONS (fins al 21 desembre)
 Totes i tots han d'escriure un o més comentaris sobre el que pensen i senten. Es recomana sinceritat i elegància i urtugrafìa. 
 Si hi ha alguna cosa que vols dir, ara es un bon moment per posar-se emocional, crítica, reflexiva, per insultar, declarar-se... Treu-t'ho de sobre abans d'acabar l'any!
 Si vols escriure algo lleuger i graciosete, tb està bé. 
 Fins i tot, pots tornar a donar la teva opinió sobre la vaga de taxis o la crema de containers, pero no siguis pallissotes i tira més cap a sanar traumes
 Es recomana MOLT escriure mínim una confessió, no hi ha màxim pero intenteu no ser trolls i rebentar el joc amb parides.

 *** FASE2: REVISAR CONFESSIONS (fins al 24 desembre)
 Les usuaries podran llegir altres confessions (recorda, es sempre anonim!), i puntuar si estan d'acord o no

 *** FASE3: OBRIR LA CAIXA DE PANDORA (a partir del 26 desembre)
 Benvingut le caos!
 Les confessions es podrán veure, segurament en una llista de les més votades a menys. 
 Recorda que totes les confessions son anonimes!! Mai ningú sabrá qui ha escrit que.


 FAQS:
 * Si tot es anònim, perque m'he d'autenticar amb el mail?
    T'has d'autenticar perque durant el procés de revisió (FASE 2), no et toqui revisar els teus propis comentaris.
    Un cop entres a la app, es crea un alias encryptat per a cada confessió que posteges (algo rollo "U2FsdGVkX1+huzT/mYd0ELvcFIejL/G1c/8XOCKWtwU=").
    Ningu pot saber qui es l'autor de res.
    A part, els correus molen, perque així de pas podem fer spam si no ens feu cas.
 
`;

function InfoPage({ history }) {
  return (
    <div
      style={{ margin: "none", textAlign: "left", touchAction: "manipulation" }}
    >
      <h1
        style={{}}
        onClick={() => {
          history.push("/");
        }}
      >
        🏠 tornar
      </h1>

      <div style={{ whiteSpace: "pre-wrap", margin: "24px" }}>{info}</div>
    </div>
  );
}

export default InfoPage;
