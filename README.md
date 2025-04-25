# Projet 9 – Débuggez et testez un SaaS RH

Ce projet est le neuvième du parcours **Développeur d'application JavaScript React** chez OpenClassrooms. Il consiste à intervenir sur une application existante, **Billed**, utilisée en entreprise pour gérer les notes de frais, afin de corriger les bugs et garantir sa stabilité via des tests unitaires, d’intégration et manuels.

---

## 🎯 Objectif

- Identifier et corriger les **bugs** dans l'application.
- Écrire des **tests automatisés** (unitaires & d’intégration).
- Rédiger un **plan de test manuel**.
- Améliorer la **qualité globale** du projet et sa **maintenabilité**.

---

## 🛠️ Technologies utilisées

- JavaScript (ES6+)
- Jest (tests)
- Node.js / Express (pour le back-end)
- Live Server (pour servir le front)
- Git & GitHub

---

## 📂 Structure du projet

```
Billed/
├── Billed-app-FR-Front/   → Code du front (interface employé + admin)
│   ├── src/
│   ├── __tests__/
│   └── ...
├── Billed-app-FR-Back/    → Serveur mocké (Node.js / Express)
│   ├── server.js
│   └── ...
└── README.md
```

---

## ▶️ Lancer le projet en local

### 1. Cloner le dépôt

```bash
git clone https://github.com/Kurts350/P9_Billed.git
cd Billed
```

---

## 🚀 Lancer le back-end

### 📌 Prérequis

- Node.js (v16 ou 18 recommandé)

### 📦 Installation & démarrage

```bash
cd Billed-app-FR-Back
npm install
npm run run:dev
```

Par défaut, le serveur tourne sur : `http://localhost:5678`

---

## 💻 Lancer le front-end

### 📦 Installation

```bash
cd ../Billed-app-FR-Front
npm install
```

### ▶️ Démarrer avec Live Server

Ouvrir le fichier `index.html` avec **Live Server** dans VS Code  
ou utiliser en ligne de commande :

```bash
npx live-server
```

L’interface est disponible sur `http://127.0.0.1:8080`

---

## 🧪 Lancer les tests

Depuis le dossier `Billed-app-FR-Front` :

```bash
npm run test
```

### ✅ Rapport de couverture

Après les tests, le rapport de couverture est accessible à :
```
Billed-app-FR-Front/coverage/lcov-report/index.html
```

---

## 👥 Comptes de connexion

- **Employé**  
  - Email : `employee@test.tld`  
  - Mot de passe : `employee`

- **Administrateur**  
  - Email : `admin@test.tld`  
  - Mot de passe : `admin`

---

## ✅ Checklist de validation

- [x] Bugs identifiés et corrigés
- [x] Tests unitaires / intégration écrits avec Jest
- [x] Plan de test manuel réalisé
- [x] Application fonctionnelle (front + back)
- [x] Rapport de couverture généré

---

## 📄 Licence

Projet réalisé à des fins pédagogiques dans le cadre de la formation OpenClassrooms – Développeur d'application JavaScript React.

---

## 👤 Auteur

**NIAKATE Biaguy**  
Formation Développeur d'application JavaScript React – OpenClassrooms  
📅 Avril 2025
