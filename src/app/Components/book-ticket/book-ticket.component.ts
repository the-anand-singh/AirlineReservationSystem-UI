import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from 'src/app/Services/ticket.service';
import { Ticket } from 'src/app/ticket';

@Component({
  selector: 'app-book-ticket',
  templateUrl: './book-ticket.component.html',
  styleUrls: ['./book-ticket.component.css'],
})
export class BookTicketComponent implements OnInit {
  public ticket: Ticket;
  public fare: number;
  public isLoading: boolean;
  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private router: Router
  ) {
    this.ticket = new Ticket();
    this.ticket.PassengerName = sessionStorage.getItem('UserName') || '';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.ticket.FlightId = params['id'];
      this.fare = params['fare'];
    });
  }

  onSubmit(form: NgForm) {
    this.ticket.DateOfBooking = new Date();
    this.ticket.TotalFare = this.fare * form.value.NoOfTickets;
    this.ticket.Status = 'Booked';
    this.ticket.TicketNo = 123;
    this.ticketService.bookTicket(this.ticket).subscribe((res) => {
      console.log(res);
      if (
        res.message === 'Booking Request is being Processed' ||
        res.isSuccess === true
      ) {
        window.alert('Your booking number is ' + res.reservation.ticketNo);
        this.isLoading = true;
        setTimeout(() => {
          this.router.navigate(['../ViewReservations'], {
            relativeTo: this.route,
          });
        }, 500);
      } else {
        this.isLoading = false;
        window.alert('This flight is already fully booked');
      }
    });
  }
}
