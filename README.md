<h1>API para controle de agendamentos</h1>

<h2><a href="https://www.getpostman.com/collections/302f9f4a4e0c64e71f7d">POSTMAN Collection</a></h2>

<h2>Rotas</h2>
<ul>
  <li>
    <strong>Cadastro de agendamentos</strong><br/>
    HTTP VERB: POST<br/>
    ROTA: 'appointments'<br/>
    EXEMPLO DE REQUEST (BODY):<br/>
    <pre><code>{
  "type": 0,
  "date": "09-10-2020",
  "intervals": [{ "start": "10:00", "end": "11:00" }]
}</code></pre>
    <p>Se não houver nenhum outro agendamento com hórario conflitante, insere o agendamento no banco de dados</p>
  </li>
  <li>
    <strong>Remoção de agendamentos</strong><br/>
    HTTP VERB: DELETE<br/>
    ROTA: 'appointments'<br/>
    EXEMPLO DE REQUEST (BODY):<br/>
    <pre><code>{
  "type": 0,
  "date": "09-10-2020",
  "intervals": [{ "start": "10:00", "end": "11:00" }]
}</code></pre>
    <p>Se houver algum agendamento com mesmo hórario, tipo, data e dias, remove o agendamento do banco de dados</p>
  </li>
  <li>
    <strong>Listagem de agendamentos</strong><br/>
    HTTP VERB: GET<br/>
    ROTA: 'appointments'
    <p>Retorna todos os agendamentos cadastrados</p>
  </li>
  <li>
    <strong>Listagem de horários disponíveis</strong><br/>
    HTTP VERB: GET<br/>
    ROTA: 'appointments/available'<br/>
    EXEMPLO DE REQUEST (BODY):<br/>
    <pre><code>{
  "start": "09-11-2020",
  "end": "10-11-2020"
}</code></pre>
    <p>Retorna todos os hoários disponíveis dentro de um determinado intervalo</p>
  </li>
</ul>

<h2>Entidades</h2>
<ul>
  <li>
    <strong>Tipo de agendamento</strong><br/>
    ÚNICO = 0<br/>
    DIÁRIO = 1<br/>
    SEMANAL = 2
  </li>
  <li>
    <strong>Dia</strong><br/>
    DOMINGO = 0<br/>
    SEGUNDA = 1<br/>
    TERÇA = 2<br/>
    QUARTA = 3<br/>
    QUINTA = 4<br/>
    SEXTA = 5<br/>
    SÁBADO = 6
  </li>
</ul>
