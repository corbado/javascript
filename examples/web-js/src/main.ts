import Corbado from "@corbado/web-js"

Corbado.load({
  projectId: import.meta.env.VITE_CORBADO_PROJECT_ID,
})

if (Corbado.user) {
    window.location.href = new URL(`./pages/index.html`, import.meta.url).href
} else {
    window.location.href =  new URL(`./pages/auth.html`, import.meta.url).href
}