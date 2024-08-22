import { } from './firebase/firebase_config.js';

document.addEventListener('DOMContentLoaded', function() {
    const activeTicketsSectionBtn = document.getElementById('active_tickets_section_btn');
    const inactiveTicketsSectionBtn = document.getElementById('inactive_tickets_section_btn');

    const activeTicketsSection = document.getElementById('active_tickets_section');
    const inactiveTicketsSection = document.getElementById('inactive_tickets_section');

    const ticketsList = document.querySelector('.tickets');
    const usedTicketsList = document.querySelector('.used-tickets');

    const qrVideo = document.querySelector('#qrVideo');

    function showSection(section) {
        document.querySelectorAll('.content-section').forEach(sec => sec.style.display = 'none');
        section.style.display = 'flex';
    }

    function initializeSections() {

        activeTicketsSectionBtn.addEventListener('click', () => {
            document.querySelector('.container-body').style.display = 'flex';
            activeTicketsSectionBtn.setAttribute('class','icon active');
            inactiveTicketsSectionBtn.setAttribute('class','icon');
            showSection(activeTicketsSection);
        });

        inactiveTicketsSectionBtn.addEventListener('click', () => {
            document.querySelector('.container-body').style.display = 'flex';
            activeTicketsSectionBtn.setAttribute('class','icon');
            inactiveTicketsSectionBtn.setAttribute('class','icon active');
            showSection(inactiveTicketsSection);
        });
    }

    /*qrButton.addEventListener('click', () => {
        
    });*/

    document.querySelector('#close-qr-code-popup').addEventListener('click', () => {
        const popup = document.querySelector('.qr-code-popup');
        popup.style.display = 'none';
        qrVideo.pause();
    });

    window.addEventListener("click", (event) => {
        const popup = document.querySelector(".qr-code-popup");
        if (event.target === popup) {
            popup.style.display = "none";
            qrVideo.pause();
        }
    });


    async function loadActiveTickets() {
        const db = firebase.firestore();
        const ticketActiveDb = await db.collection('tickets').where('status', '==', 'Em andamento').get();
        const ulTicket = document.querySelector('.tickets');
        ulTicket.innerHTML = ''; // Limpa a lista antes de adicionar novos itens
    
        ticketActiveDb.forEach((ticket) => {
            const li = document.createElement('li');
            li.setAttribute('class', 'ticket');
            
            
            const div_1 = document.createElement('div');
            div_1.setAttribute('class','ticket-header');
    
            const p_header_1 = document.createElement('p');
            p_header_1.setAttribute('class','ticket-id');
            p_header_1.innerHTML = 'ID: ' + ticket.data().codigo;
    
            const p_header_2 = document.createElement('p');
            p_header_2.setAttribute('class','ticket-status');
            p_header_2.innerHTML = 'Status: ' + ticket.data().status;
    
            div_1.appendChild(p_header_1);
            div_1.appendChild(p_header_2);
    
            const div_2 = document.createElement('div');
            div_2.setAttribute('class','ticket-body');
    
            const p_body_1 = document.createElement('p');
            p_body_1.innerHTML = 'Nome do paciente:';

            const span_p_body_1 = document.createElement('span');
            span_p_body_1.setAttribute('class','ticket-description');
            span_p_body_1.innerHTML = ticket.data().paciente_pessoa;
            
            const br = document.createElement('br'); // Para quebrar a linha D: 

            p_body_1.appendChild(br);
            p_body_1.appendChild(span_p_body_1);
    
            const p_body_2 = document.createElement('p');
            p_body_2.innerHTML = 'Nome do visitante: ';
            const span_p_body_2 = document.createElement('span');
            span_p_body_2.setAttribute('class','ticket-description');
            span_p_body_2.innerHTML = ticket.data().nome_pessoa;
            
            const br_2 = document.createElement('br');
            p_body_2.appendChild(br_2);
            p_body_2.appendChild(span_p_body_2);
    
            const p_body_3 = document.createElement('p');
            p_body_3.innerHTML = 'Quarto: ';
            const span_p_body_3 = document.createElement('span');
            span_p_body_3.setAttribute('class','ticket-description');
            span_p_body_3.innerHTML = '5-B'; // Mudar isso depois com a API do hospital
    
            p_body_3.appendChild(span_p_body_3);
    
            const p_body_4 = document.createElement('p');
            p_body_4.innerHTML = 'CPF do paciente: ';
            const span_p_body_4 = document.createElement('span');
            span_p_body_4.setAttribute('class','ticket-description');
            span_p_body_4.innerHTML = ticket.data().cpf_paciente.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');;
    
            p_body_4.appendChild(span_p_body_4);
    
            const p_body_5 = document.createElement('p');
            p_body_5.innerHTML = 'CPF do visitante: ';
            const span_p_body_5 = document.createElement('span');
            span_p_body_5.setAttribute('class','ticket-description');
            span_p_body_5.innerHTML = ticket.data().cpf_pessoa.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');;
    
            p_body_5.appendChild(span_p_body_5);
    
            div_2.appendChild(p_body_1);
            div_2.appendChild(p_body_2);
            div_2.appendChild(p_body_3);
            div_2.appendChild(p_body_4);
            div_2.appendChild(p_body_5);
    
            const div_3 = document.createElement('div');
            div_3.setAttribute('class','ticket-footer');
    
            const button_qr_code = document.createElement('button');
            button_qr_code.setAttribute('class','qr-code-button');
            button_qr_code.setAttribute('id','qr-code-btn');
            button_qr_code.addEventListener('click', () => {
                validateTicket(ticket);
            });

            const icon_for_btn = document.createElement('i');
            icon_for_btn.setAttribute('class','fa-solid fa-qrcode');

            button_qr_code.appendChild(icon_for_btn);

            const span_footer_date = document.createElement('span');
            span_footer_date.setAttribute('class','ticket-creation-date');
            span_footer_date.innerHTML = ticket.data().data_emissao;
    
            div_3.appendChild(button_qr_code);
            div_3.appendChild(span_footer_date);
    
            li.appendChild(div_1);
            li.appendChild(div_2);
            li.appendChild(div_3);
    
            ulTicket.appendChild(li);
        });
    }
    

    function loadInactiveTickets() {
        const inactiveTickets = ['Ticket A', 'Ticket B'];
        usedTicketsList.innerHTML = '';
        inactiveTickets.forEach(ticket => {
            const li = document.createElement('li');
            li.textContent = ticket;
            usedTicketsList.appendChild(li);
        });
    }

    async function validateTicket(ticket){

        const popup = document.querySelector('.qr-code-popup');
        popup.style.display = 'block';
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then((stream) => {
                qrVideo.style.display = 'block';
                qrVideo.srcObject = stream;
                qrVideo.play();

                // Implementar a leitura de QR code aqui
            })
            .catch((err) => {
                console.error("Erro ao acessar a câmera: ", err);
            });
    }

    initializeSections();
    loadActiveTickets();
    loadInactiveTickets();
});
