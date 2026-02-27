export async function onRequestGet(context) {
  try {
    const db = context.env.DB;
    // Conta quantas propostas existem no banco
    const result = await db.prepare("SELECT COUNT(*) as total FROM propostas").first();
    
    // Calcula o próximo número
    const proximoNumero = result.total + 1;
    
    // Formata o ID. Ex: Ano atual + número com 3 zeros (2026001)
    const ano = new Date().getFullYear();
    const idFormatado = String(proximoNumero).padStart(3, '0');
    
    return new Response(JSON.stringify({ next: `${ano}${idFormatado}` }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (erro) {
    // Se der erro (ex: banco vazio), gera um número de segurança
    const ano = new Date().getFullYear();
    return new Response(JSON.stringify({ next: `${ano}001` }));
  }
}
