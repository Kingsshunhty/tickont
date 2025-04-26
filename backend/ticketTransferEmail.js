// ticketTransferEmail.js
function buildTicketTransferEmail({
  firstName,
  senderFullName,
  eventTitle,
  eventLocation,
  eventDateTime,
  quantity = 1,
  section,
  row,
  seats = [],
  ticketId,
  acceptUrl,
  logoUrl = "https://image.mailing.ticketmaster.com/lib/fea015737460007f75/m/26/81d94a4c-1171-4900-992c-8a049f9d7ffc.png",
}) {
  const qs = new URLSearchParams({
    eventTitle,
    quantity,
    eventLocation,
    section,
    eventDateTime,
    ticketId,
  }).toString();

  /* ticket-, calendar- & venue-icons from Ticketmaster’s CDN */
  const icons = {
    ticket:
      "https://image.mailing.ticketmaster.com/lib/fe9e15747366047975/m/1/f28e29a5-816c-456f-9be4-8003cbcd1218.png",
    venue:
      "https://image.mailing.ticketmaster.com/lib/fe9e15747366047975/m/1/e08ab839-29f0-4849-8f9f-39a1c73df875.png",
    calendar:
      "https://image.mailing.ticketmaster.com/lib/fe9e15747366047975/m/1/eafb3c6f-15c2-4d46-a66e-84dede326386.png",
  };

  /* inline arrow-divider (base64 PNG, 284 × 43) */
  const arrowDivider =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARwAAAArCAYAAACq/DdBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAASnSURBVHgB7Z0/dBzVFcfn85Mzswv3Zs5cOZmBAZFSB4ogAzQxkBEiPSkKqKMaBrWp3QRKb1Rp7Cva+3XXqV2qdur7qVqqHdRrl315WlVlbdWlNW3utgxrVm5gYFbDJ32iOO/uec/O988q2bm3PvfOcc85953zuf73e+71zz33nHNcJ/YgJnBKBpdQsCCbrRcLCsp56zS8G9k9nwzG9k1NHs67btesD3myD9+jTwbNWdCsYxl02O9VO5EV/RPQtLsqw+HtJqsNxHz7nHveByXN63YdkUXyqkH+9UjhoNIQ6m0GfHv7N1J1eXvPn3n9T0Qk1jwmyCfvPCr/ZTUferzx2N+PtYmmvWouiUUQhH2wWWaOH33XTPGsUdiqLzxW/fLOxXW5L5VzFeJdIm8MP9R606ChumCKalq9yKy3G3MLF0zH0ZNGVKwxb/EyiCPfNr1k21Kk8hYl5iboU25Q5kp9BSv+Knn4mL+XhQP68R0Z10hLbWcX622akRH6rwWSVaDuX6YqaDrYE5nk49vjv0jkvn6Ic+PLRV5ko8djdpP3gnG0gl59YHq5L5oYRF7MTO5Z+sgsBOjvUj1M86rpk6o3PCz3XtrzmXJf37hGUdaRHDRRvv6A4XT2B6kfEJ1l+fJhNY42bSMXk+CU3WhCFrZEJKcv8EA43d0nMfREM9jEvOaUfEIfObzp5h7Aw0Ju0e2rE3E6mHMvZKoypCfZqsJhwWyPaYRMRKiUqRjEX8xXDM05lyDTH5dXBgzofk+fg9Gey3d7sqzZ4+21KbjQKa3bN2jMRpXL6kxEVbxi/jcIYVxiglRKQoNNWcygMdItEQqtDPZRxUvifQ3//uE/Ms6uNssGt4bDX3atOHeabj3s0tX1MmiO85V3culdUonU0J8gLUTqbO9eLVlM0dpvF29h3t2uw2aacXnG1gW45Ygc2msypXSVZ9VZ9DWKXMutZJngsls60EzJxMNNKk71caUN8Ouu5Gy6kPrfHLbac7DSS1+285UfP/SxEJVCK3GsJy8uyB4Hu+MFmgU3ePy9K3lOWxZfYO5k5y13ewu2RoiRTpEzZsSVbiuU4teI0hq3EsZWkdRLFcOoIKZzWSFoE6X9FW+SP";

  /* one row only - section & row repeat once, seats comma-separated */
  const seatRow = `<tr><td>${section}</td><td>${row}</td><td>${(Array.isArray(
    seats
  )
    ? seats
    : [seats]
  ).join(", ")}</td></tr>`;

  return {
    subject: `You’ve got a ticket transfer from ${senderFullName}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>Ticket Transfer</title>
<style>
  body{margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;color:#333}
  .wrapper{width:100%;padding:20px 0}
  .container{width:600px;margin:0 auto;background:#fff;border:1px solid #ddd}
  /* header gets the same image used in your big confirmation email */
  .header{
    background:url('https://image.mailing.ticketmaster.com/lib/fe9e15747366047975/m/1/b58a380c-2533-49ff-b916-3059814c1503.png') center top no-repeat #0052b1;
    background-size:cover;
    padding:20px 20px 50px;
    position:relative;
  }
  .header img.logo{position:absolute;top:20px;left:20px;max-width:150px}
  .header h1{margin:0;text-align:center;color:#fff;font-size:32px;font-weight:700}
  .content{padding:30px}
  .greeting{font-size:16px;margin-bottom:25px}
  .ticket-box{border:1px solid #e7e7e7}
  .block{padding:18px 22px}
  .divider{border-top:1px solid #e7e7e7}
  .icon{vertical-align:middle;margin-right:6px}
  .label{font-size:14px;vertical-align:middle}
  .qty-row{display:flex;align-items:center;font-size:14px;font-weight:bold;margin:0}
  .details-table{width:100%;border-collapse:collapse;margin-top:12px}
  .details-table th{font-size:11px;color:#0052b1;padding-bottom:4px;text-align:left}
  .details-table td{font-size:13px;padding:5px 0}
  .cta{text-align:center;padding:20px 0}
  .btn{background:#0052b1;color:#fff;text-decoration:none;padding:12px 36px;border-radius:4px;font-size:16px;display:inline-block}
  .footer{font-size:12px;color:#999;text-align:center;padding:15px;border-top:1px solid #eee}
</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">

      <!-- header -->
      <div class="header">
        <img src="${logoUrl}" alt="Ticketmaster" class="logo"/>
        <h1>Ticket Transfer</h1>
      </div>

    

      <!-- main body -->
      <div class="content">
        <p class="greeting">
          Hi ${firstName},<br/>
          <strong>${senderFullName}</strong> has sent you a ticket.
        </p>

        <!-- ticket box -->
        <div class="ticket-box">

          <!-- block 1 : event heading -->
          <div class="block">
            <h2 style="margin:0 0 8px;font-size:18px;">${eventTitle}</h2>
            <p class="label"><img src="${icons.venue}" width="16" height="16" class="icon" alt="venue"/>${eventLocation}</p>
            <p class="label" style="margin-top:6px;"><img src="${icons.calendar}" width="16" height="16" class="icon" alt="calendar"/>${eventDateTime}</p>
          </div>

          <div class="divider"></div>

          <!-- block 2 : quantity -->
          <div class="block" style="padding-bottom:12px">
            <p class="qty-row"><img src="${icons.ticket}" width="20" height="20" class="icon" alt="ticket"/>x${quantity} ticket(s)</p>
          </div>

          <div class="divider"></div>

          <!-- block 3 : seat details -->
          <div class="block" style="padding-top:12px;">
            <p style="font-size:13px;margin:0 0 10px;"><strong>Details:</strong></p>
            <table class="details-table">
              <thead><tr><th style="width:50%">Section</th><th style="width:16%">Row</th><th style="width:16%">Seat</th></tr></thead>
              <tbody>${seatRow}</tbody>
            </table>
          </div>

          <div class="divider"></div>

          <!-- accept btn -->
          <div class="cta"><a href="https://tickont-3.onrender.com/ticketmaster?eventTitle=${encodeURIComponent(eventTitle)}&quantity=${quantity}&eventLocation=${encodeURIComponent(eventLocation)}&section=${encodeURIComponent(section)} &eventDateTime=${encodeURIComponent(eventDateTime)}&ticketId=${ticketId}" class="btn">Accept ticket(s)</a></div>
        </div>

        <p style="font-size:13px;color:#555;line-height:1.5;margin-top:25px;">
          Accepting your tickets is free. Log in or create a Ticketmaster account to accept.
          If your event is postponed, cancelled or rescheduled, please contact the point of sale for further information.
        </p>
      </div>

      <!-- footer -->
      <div class="footer">© 2025 Ticketmaster. This email does not grant entry to the event.</div>

    </div>
  </div>
</body>
</html>`.trim(),
  };
}

module.exports = buildTicketTransferEmail;
