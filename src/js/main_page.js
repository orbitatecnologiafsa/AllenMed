document.addEventListener('DOMContentLoaded', function() {
    const qrSectionBtn = document.getElementById('qr_section_btn');
    const activeTicketsSectionBtn = document.getElementById('active_tickets_section_btn');
    const inactiveTicketsSectionBtn = document.getElementById('inactive_tickets_section_btn');

    const qrCodeSection = document.getElementById('qr_code_section');
    const activeTicketsSection = document.getElementById('active_tickets_section');
    const inactiveTicketsSection = document.getElementById('inactive_tickets_section');

    const qrButton = document.getElementById('qr_code_btn');
    const qrVideo = document.getElementById('qr_video');
    const closeQrBtn = document.getElementById('close_qr_btn');

    const ticketsList = document.querySelector('.tickets');
    const usedTicketsList = document.querySelector('.used-tickets');

    function showSection(section) {
        document.querySelectorAll('.content-section').forEach(sec => sec.style.display = 'none');
        section.style.display = 'block';
    }

    function initializeSections() {
        qrSectionBtn.addEventListener('click', () => {
            document.querySelector('.container-body').style.display = 'flex';
            qrSectionBtn.setAttribute('class','icon active-session');
            activeTicketsSectionBtn.setAttribute('class','icon');
            inactiveTicketsSectionBtn.setAttribute('class','icon');
            showSection(qrCodeSection);
        });

        activeTicketsSectionBtn.addEventListener('click', () => {
            document.querySelector('.container-body').style.display = 'flex';
            qrSectionBtn.setAttribute('class','icon');
            activeTicketsSectionBtn.setAttribute('class','icon active-session');
            inactiveTicketsSectionBtn.setAttribute('class','icon');
            showSection(activeTicketsSection);
        });

        inactiveTicketsSectionBtn.addEventListener('click', () => {
            document.querySelector('.container-body').style.display = 'flex';
            qrSectionBtn.setAttribute('class','icon');
            activeTicketsSectionBtn.setAttribute('class','icon');
            inactiveTicketsSectionBtn.setAttribute('class','icon active-session');
            showSection(inactiveTicketsSection);
        });
    }

    qrButton.addEventListener('click', () => {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then((stream) => {
                qrVideo.style.display = 'block';
                qrVideo.srcObject = stream;
                qrVideo.play();
                closeQrBtn.style.display = 'inline-block';
                qrButton.style.display = 'none';

                // Implementar a leitura de QR code aqui
            })
            .catch((err) => {
                console.error("Erro ao acessar a câmera: ", err);
            });
    });

    closeQrBtn.addEventListener('click', () => {
        qrVideo.pause();
        qrVideo.srcObject.getTracks().forEach(track => track.stop());
        qrVideo.style.display = 'none';
        closeQrBtn.style.display = 'none';
        qrButton.style.display = 'inline-block';
    });

    function loadActiveTickets() {
        const activeTickets = ['Ticket 1', 'Ticket 2', 'Ticket 3'];
        //ticketsList.innerHTML = '';
        activeTickets.forEach(ticket => {
            const li = document.createElement('li');
            li.textContent = ticket;
            ticketsList.appendChild(li);
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

    initializeSections();
    loadActiveTickets();
    loadInactiveTickets();
});
