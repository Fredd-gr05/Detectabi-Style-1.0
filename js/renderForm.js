// renderForm.js – primeira versão Detectabi Style 1.0
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('formularioContainer');

  try {
    const response = await fetch('../config/form_config.json');
    const data = await response.json();

    if (!data.categorias) throw new Error("Arquivo JSON sem categorias");

    data.categorias.forEach(cat => {
      const section = document.createElement('div');
      section.classList.add('section');

      const title = document.createElement('h3');
      title.innerHTML = `<span>${cat.icone || '📁'}</span>${cat.titulo}`;
      section.appendChild(title);

      cat.campos.forEach(campo => {
        const label = document.createElement('label');
        label.setAttribute('for', campo.id);
        label.textContent = campo.label + (campo.obrigatorio ? ' *' : '');
        section.appendChild(label);

        let input;
        switch (campo.tipo) {
          case 'select':
            input = document.createElement('select');
            campo.opcoes?.forEach(opt => {
              const option = document.createElement('option');
              option.value = typeof opt === 'string' ? opt : opt.valor;
              option.textContent = typeof opt === 'string' ? opt : opt.label;
              input.appendChild(option);
            });
            break;
          case 'checkbox':
            input = document.createElement('input');
            input.type = 'checkbox';
            break;
          case 'textarea':
            input = document.createElement('textarea');
            break;
          default:
            input = document.createElement('input');
            input.type = campo.tipo || 'text';
        }
        input.id = campo.id;
        input.required = campo.obrigatorio || false;
        section.appendChild(input);
      });

      container.appendChild(section);
    });

    // Atualiza a barra de progresso (básico)
    atualizarProgressoBasico();

  } catch (error) {
    container.innerHTML = `<div class="erro">Erro ao carregar formulário: ${error.message}</div>`;
  }
});

function atualizarProgressoBasico() {
  const total = document.querySelectorAll('input, select, textarea').length;
  const preenchidos = Array.from(document.querySelectorAll('input, select, textarea'))
    .filter(el => el.value || el.checked).length;
  const porcent = Math.round((preenchidos / total) * 100) || 0;

  document.getElementById('progressBar').style.width = `${porcent}%`;
  document.getElementById('progressText').textContent = `Progresso: ${porcent}% completado`;
}
