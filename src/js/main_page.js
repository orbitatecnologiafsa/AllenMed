import { } from './firebase/firebase_config.js';
import { mostrarNotificacao, confirmNotificacao } from './alert.js'

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


    async function loadActiveTickets(value) {
        const db = firebase.firestore();
        const ticketActiveDb =  db.collection('tickets');
        const ticketsActiveNoFilter = await ticketActiveDb.where('status', '==', 'Em andamento').get();
        const ulTicket = document.querySelector('#tickets-ativos-ul');
        ulTicket.innerHTML = ''; 
    
        if(value != null){
            const start = value;
            const end = value + '\uf8ff';

            const ticketSearched = await ticketActiveDb.where('codigo','>=',start).where('codigo','<=',end).where('status', '==', 'Em andamento').get();
            if(ticketSearched.empty){
                mostrarNotificacao('error','Nenhum ticket foi encontrado com esse ID. Tente novamente!','Nenhum ticket encontrado!');
                ticketsActiveNoFilter.forEach((ticket) => {
                    fillActiveTickets(ticket);
                });
            }
            else{
                ticketSearched.forEach(ticket => {
                    fillActiveTickets(ticket);
                });
            } 
        }
        else{
            ticketsActiveNoFilter.forEach((ticket) => {
                fillActiveTickets(ticket);
            });
        }
        
    }
    
    function fillActiveTickets(ticket){
        const ulTicket = document.querySelector('#tickets-ativos-ul');
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
            
            p_body_1.appendChild(span_p_body_1);
    
            const p_body_2 = document.createElement('p');
            p_body_2.innerHTML = 'Nome do visitante: ';
            const span_p_body_2 = document.createElement('span');
            span_p_body_2.setAttribute('class','ticket-description');
            span_p_body_2.innerHTML = ticket.data().nome_pessoa;
            
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
            span_footer_date.innerHTML = 'Data de criação: ' + ticket.data().data_emissao;
    
            div_3.appendChild(button_qr_code);
            div_3.appendChild(span_footer_date);
    
            li.appendChild(div_1);
            li.appendChild(div_2);
            li.appendChild(div_3);
    
            ulTicket.appendChild(li);
    }

    async function loadInactiveTickets(value) {

        const db = firebase.firestore();
        const ticketInactiveDb =  db.collection('tickets');
        const ticketsInactiveNoFilter = await ticketInactiveDb.where('status', '==', 'Finalizado').get();

        const ulTicket = document.querySelector('#tickets-inativos-ul');
        ulTicket.innerHTML = ''; 
    
        if(value != null){
            const start = value;
            const end = value + '\uf8ff';

            const ticketSearched = await ticketInactiveDb.where('codigo','>=',start).where('codigo','<=',end).where('status','==','Finalizado').get();
            if(ticketSearched.empty){
                alert('Nenhum ticket encontrado!');
                ticketsInactiveNoFilter.forEach((ticket) => {
                    fillInactiveTickets(ticket);
                });
            }
            else{
                ticketSearched.forEach(ticket => {
                    fillInactiveTickets(ticket);
                });
            } 
        }
        else{
            ticketsInactiveNoFilter.forEach((ticket) => {
                fillInactiveTickets(ticket);
            });
        }
    }

    function fillInactiveTickets(ticket){

        const ulTicket = document.querySelector('#tickets-inativos-ul');
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
            
            p_body_1.appendChild(span_p_body_1);
    
            const p_body_2 = document.createElement('p');
            p_body_2.innerHTML = 'Nome do visitante: ';
            const span_p_body_2 = document.createElement('span');
            span_p_body_2.setAttribute('class','ticket-description');
            span_p_body_2.innerHTML = ticket.data().nome_pessoa;
            
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
    
            const span_footer_date_start = document.createElement('span');
            span_footer_date_start.setAttribute('class','ticket-creation-date');
            span_footer_date_start.innerHTML = 'Data de criação: ' + ticket.data().data_emissao;

            const span_footer_date_end = document.createElement('span');
            span_footer_date_end.setAttribute('class','ticket-creation-date');
            span_footer_date_end.innerHTML = 'Data de baixa: ' + ticket.data().data_baixa;
    
            div_3.appendChild(span_footer_date_start);
            div_3.appendChild(span_footer_date_end);
    
            li.appendChild(div_1);
            li.appendChild(div_2);
            li.appendChild(div_3);
    
            ulTicket.appendChild(li);
    }

    async function validateTicket(ticket) {
        const popup = document.querySelector('.qr-code-popup');
        popup.style.display = 'block';
    
        const qrVideo = document.querySelector('#qrVideo'); 
        const canvasElement = document.createElement('canvas');
        const canvas = canvasElement.getContext('2d');
    
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then((stream) => {
                qrVideo.style.display = 'block';
                qrVideo.srcObject = stream;
                qrVideo.play();
    
                const interval = setInterval(async () => {
                    canvasElement.width = qrVideo.videoWidth;
                    canvasElement.height = qrVideo.videoHeight;
                    canvas.drawImage(qrVideo, 0, 0, canvasElement.width, canvasElement.height);
                    
                    const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
                    const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
    
                    if (qrCode) {
                        console.log("QR Code detectado: ", qrCode.data);
    
                        clearInterval(interval);
                        qrVideo.srcObject.getTracks().forEach(track => track.stop());
    
                        if(ticket.data().codigo != qrCode.data){
                            mostrarNotificacao("error","QrCode inválido","Esse QrCode é inválido, tente novamente");
                            popup.style.display = 'none';
                        }
                        else if(ticket.data().codigo == qrCode.data && ticket.data().status == 'Finalizado'){
                            mostrarNotificacao('error','QrCode finalizado','Esse QrCode já foi finalizado.');
                            popup.style.display = 'none';
                        }
                        else{
                            const confirm =  await confirmNotificacao(
                                'Esse QrCode é valido. Deseja dar baixa?',
                                'Baixa de QrCode',
                                'A entrada do visitante foi liberada',
                                'A entrada do visitante foi rejeitada',
                            )
                            if(confirm){
                                approveTicket(ticket);
                            }else{
                                const popup = document.querySelector('.qr-code-popup');
                                popup.style.display = 'none';
                            }
                        }
                    }
                }, 100);
            })
            .catch((err) => {
                console.error("Erro ao acessar a câmera: ", err);
            });
    }

    async function approveTicket(ticket) {

        const ticketDb = firebase.firestore().collection('tickets');
        const popup = document.querySelector('.qr-code-popup');
        popup.style.display = 'none';
        try {
            const ticketDoc = await ticketDb.doc(ticket.id).get();
            
            if (ticketDoc.exists) {
                await ticketDb.doc(ticket.id).update({ status: 'Finalizado',data_baixa: new Date().toLocaleDateString() });
                console.log("Ticket atualizado com sucesso!");
            } else {
                console.log("Documento não encontrado!");
            }
        } catch (error) {
            console.error("Erro ao atualizar o ticket: ", error);
        }
        
    }
    firebase.firestore().collection('tickets').onSnapshot((ticket) => {
        ticket.docChanges().forEach((change) => {
            if (change.type === "added") {
                console.log("Novo documento adicionado: ", change.doc.data());
                loadActiveTickets(null);
            }
            if (change.type === "modified") {
                console.log("Documento modificado: ", change.doc.data());
                loadActiveTickets(null);
                loadInactiveTickets(null);
            }
            if (change.type === "removed") {
                console.log("Documento removido: ", change.doc.data());
                loadActiveTickets(null);
                loadInactiveTickets(null);
            }
        });
    });
    loadInactiveTickets();

    //Pesquisa no campo dos tickets ativos

    document.getElementById('search-form').addEventListener('submit', function(event) {
        event.preventDefault();
       
        const input = document.getElementById('search-active-ticket');
        const value = input.value.trim().toLowerCase();
        console.log(value);
        loadActiveTickets(value);
    });

    //Pesquisa no campo dos tickets invativos

    document.getElementById('search-form-inactive').addEventListener('submit', function(event) {
        event.preventDefault();
       
        const input = document.getElementById('search-inactive-ticket');
        const value = input.value.trim().toLowerCase();
        console.log(value);
        loadInactiveTickets(value);
    });

    initializeSections();
});