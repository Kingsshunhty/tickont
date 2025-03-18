require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Nodemailer Transporter (Using Gmail SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Your Gmail address
    pass: process.env.PASSWORD, // App Password (Recommended)
  },
});

app.post("/send-ticket", async (req, res) => {
  try {
    // 1) Pull dynamic fields from the request body
    const {
      emailOrMobile,
      firstName,
      lastName,
      eventTitle,
      eventLocation,
      eventDateTime,
      row,
      eventCoverImage,
      artist, // ✅ Artist Name
      tourCountry, // ✅ Tour Country
      section,
      seats, // array of seat numbers
      quantity,
      currency,
      pricePerTicket,
      itemFee,
      processingFee,
      insuranceFee,
      ticketId,
      ticketPdfUrl, // Add the ticket PDF URL here
      total,
    } = req.body;

    // 2) Convert numeric strings to actual numbers (and format to 2 decimals)
    const qtyNum = parseInt(quantity, 10) || 1;
    const pricePerTicketNum = parseFloat(pricePerTicket) || 0;
    const itemFeeNum = parseFloat(itemFee) || 0;
    const processingFeeNum = parseFloat(processingFee) || 0;
    const insuranceFeeNum = parseFloat(insuranceFee) || 0;
    const totalNum = parseFloat(total) || 0;

    // Format everything to 2 decimals
    const pricePerTicketFmt = pricePerTicketNum.toFixed(2);
    const itemFeeFmt = itemFeeNum.toFixed(2);
    const processingFeeFmt = processingFeeNum.toFixed(2);
    const insuranceFeeFmt = insuranceFeeNum.toFixed(2);
    const totalFmt = totalNum.toFixed(2);

    // Pre-calculate line-item multiples
    const pricePerTicketTotal = (pricePerTicketNum * qtyNum).toFixed(2);
    const itemFeeTotal = (itemFeeNum * qtyNum).toFixed(2);

    // 3) Build the seat rows dynamically for each seat in seats array
    // If seats is not an array, convert or handle gracefully
    const seatsArray = Array.isArray(seats) ? seats : [seats];
    const seatRowsHtml = seatsArray
      .map((seat) => {
        return `
        <tr>
          <td style="padding:10px 0px;width:40%">
            <table cellspacing="0" cellpadding="0" border="0" align="left">
              <tbody>
                <tr>
                  <td style="font-weight:bold;font-size:12px;line-height:14px;color:rgb(1,80,167)">SECTION</td>
                </tr>
                <tr>
                  <td>${section}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td style="padding:10px 0px">
            <table cellspacing="0" cellpadding="0" border="0" align="left">
              <tbody>
                <tr>
                  <td style="font-weight:bold;font-size:12px;line-height:14px;padding-left:5px;border-left:1px solid #EBEBEB;color:rgb(1,80,167)">ROW</td>
                </tr>
                <tr>
                  <td style="padding-left:5px;border-left:1px solid #EBEBEB">${row}</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td style="padding:10px 0px;width:35%">
            <table cellspacing="0" cellpadding="0" border="0" align="left">
              <tbody>
                <tr>
                  <td style="font-weight:bold;font-size:12px;line-height:14px;padding-left:5px;border-left:1px solid #EBEBEB;color:rgb(1,80,167)">SEAT</td>
                </tr>
                <tr>
                  <td style="padding-left:5px;border-left:1px solid #EBEBEB">${seat}</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        `;
      })
      .join("");

    // 4) Prepare the email details
    const mailOptions = {
      from: `"TicketMaster" <${process.env.EMAIL}>`, // 👈 Custom sender name
      to: emailOrMobile, // dynamic from front end

      // Subject: firstName + " this is the email confirmation, You’re in!"
      subject: `${firstName},  You're in! Your ${artist} - ${tourCountry} Tour ticket confirmation 2025`,

      // 5) Insert dynamic data into the HTML
      html: `
<div><br><div class="gmail_quote gmail_quote_container"><div><br><div class="gmail_quote"><div>
<div style="text-align: center;">
     <img src="https://image.mailing.ticketmaster.com/lib/fea015737460007f75/m/26/81d94a4c-1171-4900-992c-8a049f9d7ffc.png" width="135" height="20" border="0" alt="Ticketmaster" style="display:block; margin:0 auto;><br>
  </div>
  <div>
    <table cellpadding="0" cellspacing="0" border="0" width="467">
      <tbody>
        <tr>
          <td width="447" align="center" style="min-width:447px;padding:0px 10px">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tbody>
                <tr><td align="center" style="padding:10px 0px 5px;" height="43">&nbsp;</td></tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>

    <table cellpadding="0" cellspacing="0" border="0" width="467">
      <tbody>
        <tr>
          <td width="447" align="center" style="min-width:447px;padding:0px 10px">
            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width:100%">
              <tbody>
                <tr>
                  <td>
                    <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff">
                      <tbody>
                        <tr>
                          <td style="border-width:1px 1px 0px;border-style:solid;background:url('https://image.mailing.ticketmaster.com/lib/fe9e15747366047975/m/1/b58a380c-2533-49ff-b916-3059814c1503.png') center top no-repeat rgb(0,45,161);border-color:rgb(191,191,191) rgb(191,191,191)">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                              <tbody>
                                <tr>
                                  <td style="padding:26px 16px 5px;text-align:center;color:rgb(255,255,255)">
                                    <!-- Only firstName here -->
                                    <h1 dir="auto">${firstName}, You're In!</h1>
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding:0px 16px 22px;text-align:center;color:rgb(255,255,255)">
                                    <a href="#" style="text-decoration:none" target="_blank">
                                      <font style="color:rgb(255,255,255)">Order #${ticketId}</font>
                                    </a>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>

    <table cellpadding="0" cellspacing="0" border="0" width="467">
      <tbody>
        <tr>
          <td width="447" align="center" style="min-width:447px;padding:0px 10px">
            <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width:100%">
              <tbody>
                <tr>
                  <td>
                    <!-- START MAIN TICKET BOX -->
                    <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff">
                      <tbody>
                        <tr>
                          <td style="border-width:0px 1px 1px;border-style:none solid solid;border-color:currentcolor rgb(191,191,191) rgb(191,191,191)">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                              <tbody>
                                <tr>
                                  <td>
                                    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
                                      <tbody>
                                        <tr>
                                          <td>
                                            <table style="display:inline" width="215" cellspacing="0" cellpadding="0" border="0" align="left" dir="auto">
                                              <tbody>
                                                <tr>
                                                  <td style="padding:16px 0px 10px 16px;vertical-align:top;text-align:center" width="215">
                                                    <!-- Event cover image -->
                                                    <div>
                                                      <img src="${eventCoverImage}" style="width:200px;max-width:100%">
                                                    </div>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <table style="display:inline" width="200" cellspacing="0" cellpadding="0" border="0" align="right" dir="auto">
                                              <tbody>
                                                <tr>
                                                  <td style="vertical-align:top;padding-top:20px;" width="175">
                                                    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="left">
                                                      <tbody>
                                                        <tr>
                                                          <!-- Event Title -->
                                                          <td style="font-size:18px;line-height:22px;font-weight:bold;padding-left:16px;padding-right:16px">
                                                            ${eventTitle}
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="left">
                                                      <tbody>
                                                        <tr>
                                                          <td style="padding:18px 10px 16px 16px" width="18" valign="top">
                                                            <img src="https://image.mailing.ticketmaster.com/lib/fe9e15747366047975/m/1/e08ab839-29f0-4849-8f9f-39a1c73df875.png" width="16" height="21">
                                                          </td>
                                                          <!-- Location -->
                                                          <td style="padding:16px 16px 16px 0px;font-size:14px;line-height:16px;text-align:left;vertical-align:middle">
                                                            ${eventLocation}
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="left">
                                                      <tbody>
                                                        <tr>
                                                          <td style="padding:0px 10px 16px 16px" width="18" valign="top">
                                                            <img src="https://image.mailing.ticketmaster.com/lib/fe9e15747366047975/m/1/eafb3c6f-15c2-4d46-a66e-84dede326386.png" width="18" height="18">
                                                          </td>
                                                          <!-- Date & Time -->
                                                          <td style="padding:0px 16px 16px 0px;font-size:14px;line-height:16px;text-align:left;vertical-align:middle">
                                                            ${eventDateTime}
                                                          </td>
                                                        </tr>
                                                      </tbody>
                                                    </table>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        
                        <tr>
                          <td style="border-width:0px 1px 1px;border-style:none solid solid;padding-bottom:16px;border-color:currentcolor rgb(191,191,191) rgb(191,191,191)">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" align="left">
                              <tbody>
                                <tr>
                                  <td style="padding:16px 16px 0px;font-size:18px;line-height:20px">
                                    <b>Your Order</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <table style="display:inline" width="215" cellspacing="0" cellpadding="0" border="0" align="left" dir="auto">
                                      <tbody>
                                        <tr>
                                          <td style="padding:16px 5px 0px 16px;vertical-align:top" width="30">
                                            <img src="https://image.mailing.ticketmaster.com/lib/fe9e15747366047975/m/1/f28e29a5-816c-456f-9be4-8003cbcd1218.png" width="26" height="26">
                                          </td>
                                          <!-- quantity -->
                                          <td style="padding:16px 16px 0px 0px"><b>${qtyNum}x</b>  Mobile Ticket</td>
                                        </tr>
                                      </tbody>
                                    </table>

                                    <table style="display:inline" width="200" cellspacing="0" cellpadding="0" border="0" align="right" dir="auto">
                                      <tbody>
                                        <tr>
                                          <td style="padding:12px 16px 0px">
                                            <a href="${ticketPdfUrl}?fl_attachment=true&filename=ticket.pdf" target="_blank" style="text-decoration:none; display:inline-block;">
                                              <table width="168" cellspacing="0" cellpadding="0" border="0" align="right">
                                                <tbody>
                                                  <tr>
                                                    <td style="padding:0px 30px;border-radius:2px;background-color:rgb(2,108,223);color:rgb(255,255,255)" height="37" align="center">
                                                      <b>VIEW TICKETS</b>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </a>


                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>

                                <!-- Display seat lines for each ticket -->
                                <tr>
                                  <td style="padding:16px 16px 0px">
                                    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="left">
                                      <tbody>
                                        <!-- "Live Nation Presale Seats Ticket" label -->
                                        <tr>
                                          <td colspan="3" style="padding:10px 0px;border-top:1px solid #BFBFBF;border-bottom:1px solid #EBEBEB">
                                            Live Nation Presale Seats Ticket
                                          </td>
                                        </tr>
                                        <!-- Our dynamic seat rows -->
                                        ${seatRowsHtml}

                                        <!-- Price Level + currency -->
                                        <tr>
                                          <td colspan="3" style="padding:10px 0px;border-top:1px solid #EBEBEB;font-size:12px;">
                                            Price Level ${currency}${pricePerTicketFmt},  ${currency}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>

                        <tr>
                          <td style="height:30px;line-height:30px;">&nbsp;</td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- Payment Summary Table -->
                    <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff">
                      <tbody>
                        <tr>
                          <td style="padding:0px 16px">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" align="left">
                              <tbody>
                                <tr>
                                  <td style="text-align:center">
                                    <b>THIS EMAIL CANNOT BE USED FOR ENTRY</b>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tbody>
                        <tr><td style="height:30px;line-height:30px">&nbsp;</td></tr>
                      </tbody>
                    </table>

                    <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff">
                      <tbody>
                        <tr>
                          <td style="border:1px solid #BFBFBF;padding:16px 16px 0px">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" align="left">
                              <tbody>
                                <tr>
                                  <td colspan="2" style="padding-bottom:16px;font-size:18px;line-height:20px">
                                    <b>Payment Summary</b>
                                  </td>
                                </tr>

                                <tr>
                                  <td style="padding-bottom:16px">
                                    ${qtyNum} Live Nation Presale Seats Ticket<br>
                                      <font style="font-size:12px;color:rgb(100,100,100)">
                                        ${currency} ${pricePerTicketFmt} x${qtyNum}
                                      </font>
                                    
                                  </td>
                                  <td style="padding-left:10px;text-align:right;vertical-align:top">
                                    ${currency} ${pricePerTicketTotal}
                                  </td>
                                </tr>

                                <tr>
                                  <td style="padding-bottom:16px">
                                    Per Item Fees<br>
                                      <font style="font-size:12px;color:rgb(100,100,100)">
                                        ${currency} ${itemFeeFmt} (Service Charge) x${qtyNum}
                                      </font>
                                    
                                  </td>
                                  <td style="padding-left:10px;text-align:right;vertical-align:top">
                                    ${currency} ${itemFeeTotal}
                                  </td>
                                </tr>

                                <tr>
                                  <td style="padding-bottom:16px">
                                    Order Processing Fees<br>
                                      <font style="font-size:12px;color:rgb(100,100,100)">
                                        Handling Fee (${currency} ${processingFeeFmt})
                                      </font>
                                    
                                  </td>
                                  <td style="padding-left:10px;text-align:right;vertical-align:top">
                                   ${currency} ${processingFeeFmt}
                                  </td>
                                </tr>

                                <tr>
                                  <td style="padding-bottom:16px;border-top:1px solid #BFBFBF;padding-top:16px;font-size:18px;line-height:22px;">
                                    <b>Total</b>
                                  </td>
                                  <td style="width:110px;padding-left:10px;text-align:right;vertical-align:top;border-top:1px solid #BFBFBF;padding-top:16px;font-size:18px;line-height:22px;">
                                    <b>${currency} ${totalFmt}</b>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tbody><tr><td style="height:30px;line-height:30px">&nbsp;</td></tr></tbody>
                    </table>

                    <!-- Insurance Fees -->
                    <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff">
                      <tbody>
                        <tr>
                          <td style="border:1px solid #BFBFBF;padding:16px 16px 0px">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" align="left">
                              <tbody>
                                <tr>
                                  <td style="padding-bottom:16px;font-size:18px;line-height:20px">
                                    <b>Your Tickets are Insured</b>
                                  </td>
                                  <td style="padding-left:10px;text-align:right;vertical-align:top">
                                    <img src="https://image.mailing.ticketmaster.com/lib/fe9e15747366047975/m/1/ae240c4e-0b6d-4ee4-95ee-c77de1753393.png" width="20" height="20">
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2" style="padding-bottom:16px">
                                    Thank you for purchasing ticket insurance for this event, provided by Allianz Assistance.
                                    <br><br>
                                    If you have any questions regarding your insurance, or if you do not receive a confirmation email containing the details of your policy, please contact Allianz Assistance.
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding-bottom:16px;border-top:1px solid #BFBFBF;padding-top:16px">
                                    Missed Event Insurance
                                  </td>
                                  <td style="padding-left:10px;text-align:right;vertical-align:top;border-top:1px solid #BFBFBF;padding-top:16px">
                                    ${currency} ${insuranceFeeFmt}
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding-bottom:16px;border-top:1px solid #BFBFBF;padding-top:16px;font-size:18px;line-height:22px">
                                    <b>Total</b>
                                  </td>
                                  <td style="padding-left:10px;text-align:right;vertical-align:top;border-top:1px solid #BFBFBF;padding-top:16px;font-size:18px;line-height:22px">
                                    <b>${currency} ${insuranceFeeFmt}</b>
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2" style="padding-bottom:16px">
                                    <b>Payment:</b> VISA ${currency} ${insuranceFeeFmt}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tbody><tr><td style="height:30px;line-height:30px">&nbsp;</td></tr></tbody>
                    </table>

                    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="left">
                      <tbody>
                        <tr>
                          <td width="100%">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f6f6f6" align="left">
                              <tbody>
                                <tr>
                                  <td style="padding:23px 5px 12px 16px;vertical-align:top" width="35">
                                    <img src="https://image.mailing.ticketmaster.com/lib/fe9e15747366047975/m/1/d85fed21-50f9-40e5-b864-31f51db4e331.png" width="26" height="28">
                                  </td>
                                  <td style="padding:30px 16px 30px 0px">
                                    <table width="100%" cellspacing="0" cellpadding="0" border="0" align="left">
                                      <tbody>
                                        <tr>
                                          <td style="padding-bottom:16px;font-size:18px;line-height:20px">
                                            <b>Your Phone is Your Ticket</b>
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>
                                            Locate your tickets in your Ticketmaster account, or in your app. When you go mobile, your tickets will not be emailed to you or available for print.
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tbody><tr><td style="height:30px;line-height:30px">&nbsp;</td></tr></tbody>
                    </table>

                    <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff">
                      <tbody>
                        <tr>
                          <td style="border:1px solid #BFBFBF;padding:16px">
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" align="left">
                              <tbody>
                                <tr>
                                  <td style="padding-bottom:16px;font-size:18px;line-height:20px">
                                    <b>Important Information</b>
                                  </td>
                                  <td style="padding-left:10px;text-align:right;vertical-align:top">
                                    <img src="https://image.mailing.ticketmaster.com/lib/fe9e15747366047975/m/1/acd297ab-25df-4b8a-81cf-706b2f72dab1.png" width="20" height="20">
                                  </td>
                                </tr>
                                <tr>
                                  <td colspan="2">
                                    <!-- Terms and conditions text -->
                                    <p><strong>Resale restrictions</strong></p>
                                    <ol>
                                      <li>Tickets are for personal use only and may not be resold for profit and/or through unauthorised resale sites such as Viagogo or Stubhub.</li>
                                      <li>If you can no longer use your tickets and are not eligible for an exchange or refund, you may resell them through Twickets. For all authorised resale sites visit the Artist page at livenation.co.uk</li>
                                      <li>Only genuine mobile tickets will be accepted for entry. Printouts and/or screenshots of tickets will not be accepted. If you bought more than one mobile ticket and ticket transfer is unavailable, your guests must be with you at time of entry.</li>
                                      <li>A strict limit of 6 tickets per person (and per household) per event applies in the general sale and 4 tickets per person (and per household) per event applies in presales. Tickets purchased over this limit may be cancelled and invalidated (in which case you will be refunded).</li>
                                      <li>Tickets purchased or resold or offered for resale in breach of these terms may be cancelled. </li>
                                      <li>If there are any inconsistencies between these conditions and any other applicable terms and conditions, these conditions will apply.</li>
                                    </ol>
                                    <p><strong>Covid-19 safety requirements</strong><br><br>
                                    Admission to this event is at all times subject to the promoter (Live Nation) and venue operator&#39;s terms and conditions. Please ensure you read and accept these terms before purchasing tickets, in particular those relating to safety measures implemented to combat the spread of COVID-19, which may include (i) requesting audiences to demonstrate their COVID-19 status by providing proof of a negative lateral flow test, full vaccination, or natural immunity, and/or (ii) any other entry requirements recommended by government. The promoter and venue reserve the right to refuse admission to the event for failure to comply with such requirements and you will not be entitled to a refund.
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <table width="100%" cellspacing="0" cellpadding="0" border="0">
                      <tbody><tr><td style="height:30px;line-height:30px">&nbsp;</td></tr></tbody>
                    </table>

                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>

    <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#1F262D">
      <tbody>
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="467">
              <tbody>
                <tr>
                  <td width="447" align="center" style="min-width:447px;padding:30px 10px 20px">
                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="min-width:100%">
                      <tbody>
                        <tr>
                          <td>
                            <table width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#1F262D">
                              <tbody>
                                <tr>
                                  <td align="center">
                                    <table width="467" cellspacing="0" cellpadding="0" border="0">
                                      <tbody>
                                        <tr>
                                          <td style="min-width:447px;padding:0px 10px 20px" width="447" align="center">
                                            <table align="center">
                                              <tbody>
                                                <tr>
                                                  <td style="padding:0px 16px 10px;text-align:center">
                                                    <a href="#"><img alt="Blog" src="https://image.mailing.ticketmaster.com/lib/fea015737460007f75/m/26/8946d8df-0990-444e-862b-6692c6bd0bfe.png" style="width:53px;height:43px"></a>
                                                    <a href="#"><img alt="Facebook" src="https://image.mailing.ticketmaster.com/lib/fea015737460007f75/m/25/841e66f9-a22f-41cc-bbcb-bbe837e1c70b.png" style="width:53px;height:43px"></a>
                                                    <a href="#"><img alt="Twitter" src="https://image.mailing.ticketmaster.com/lib/fea015737460007f75/m/26/ea36b157-2b8d-440f-9cc5-53558609aa07.png" style="width:53px;height:43px"></a>
                                                    <a href="#"><img alt="Youtube" src="https://image.mailing.ticketmaster.com/lib/fea015737460007f75/m/26/4b220d1b-f608-4f17-b7d4-b6527234c1c5.png" style="width:53px;height:43px"></a>
                                                    <a href="#"><img alt="Instagram" src="https://image.mailing.ticketmaster.com/lib/fea015737460007f75/m/26/57f2f2fe-2f8a-423d-bb01-e6be925f4d5e.png" style="width:53px;height:43px"></a>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <table width="100%" cellspacing="0" cellpadding="0" border="0" align="left">
                                              <tbody>
                                                <tr>
                                                  <td style="padding:16px 16px 7px;font-size:13px;line-height:17px;color:rgb(255,255,255)">
                                                    <p style="padding-bottom:5px;font-size:15px;line-height:19px;font-weight:bold">
                                                     <a href="#"><font style="color:rgb(0,255,255)">Ticketmaster</font></a> |
                                                     <a href="#"><font style="color:rgb(0,255,255)">Contact us</font></a>
                                                    </p>
                                                    <p>This email confirms your ticket order, so print/save it for future reference. All purchases are subject to credit card approval, billing address verification and Terms and Conditions as set out in our
                                                      <a href="#" style="text-decoration:none"><font style="color:rgb(0,255,255)">Purchase Policy</font></a>. We make every effort to be accurate, but we cannot be responsible for changes, cancellations, or postponements announced after this email is sent.
                                                    </p>
                                                    <p>© 2022 Ticketmaster. All rights reserved.</p>
                                                    <p>Ticketmaster UK Limited. Registered in England, company number 02662632. Registered Office: <a href="#">30 St John Street, London EC1M 4AY</a></p>
                                                    <p>Please do not reply to this email. Replies to this email will not be responded to or read. If you have any questions or comments,
                                                      <a href="#" style="text-decoration:underline"><font style="color:rgb(0,255,255)">contact us</font></a>.
                                                    </p>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <img src="#" width="1" height="1" alt="">
  </div>
</div></div></div></div>
      `,
    };

    // 6) Send via Nodemailer
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      success: true,
      message: "Ticket sent successfully!",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to send ticket email." });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
