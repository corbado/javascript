const headerHTML = `<h1 class="text-2xl md:text-4xl">
        Hi <span id="userName"></span> 👋
    </h1>
    <p class="flex justify-between gap-4 font-bold mr-5 text-2xl">
        <a
        id="github-anchor"
        class="px-3"
        target="_blank"
        href="https://github.com/corbado/javascript/tree/main/packages/react"
        >
        <i class="fa-brands fa-github" id="github-icon"></i> Github
        </a>
        <a
         id="documentation-anchor"
        class="px-3"
        target="_blank"
        href="https://docs.corbado.com/frontend-integration/react?pk_vid=39aa19b26331c63f17061661133d1eca"
        >
        <i class="fa-brands fa-github" id="documentation-icon"></i> Documentation
        </a>
    </p>`;

export function insertHeader(isAuthenticated, user) {
  const header = document.getElementById('header');
  header.innerHTML = headerHTML;

  const userName = document.getElementById('userName');
  const githubAnchor = document.getElementById('github-anchor');
  const githubIcon = document.getElementById('github-icon');
  const documentationIcon = document.getElementById('documentation-icon');
  const documentationAnchor = document.getElementById('documentation-anchor');

  if (isAuthenticated) {
    userName.textContent = user ? user.name || user.orig : '';
  } else {
    userName.textContent = 'Welcome to ';
    const codeElement = document.createElement('code');
    codeElement.className = 'language-ts';
    codeElement.textContent = '@corbado/web-js';
    userName.appendChild(codeElement);
  }

  githubAnchor.onpointerenter = () => {
    githubIcon.classList.add('fa-bounce');
  };
  githubAnchor.onpointerout = () => {
    githubIcon.classList.remove('fa-bounce');
  };
  documentationAnchor.onpointerenter = () => {
    documentationIcon.classList.add('fa-bounce');
  };
  documentationAnchor.onpointerout = () => {
    documentationIcon.classList.remove('fa-bounce');
  };
}
