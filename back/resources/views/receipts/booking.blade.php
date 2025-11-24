<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprobante de Reserva</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #D4AF37;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #D4AF37;
            font-size: 32px;
            margin-bottom: 10px;
        }
        .header p {
            color: #666;
            font-size: 14px;
        }
        .booking-code {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin-bottom: 30px;
        }
        .booking-code strong {
            color: #D4AF37;
            font-size: 20px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            background: #D4AF37;
            color: white;
            padding: 10px;
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .info-row {
            display: flex;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .info-label {
            width: 40%;
            font-weight: bold;
            color: #555;
        }
        .info-value {
            width: 60%;
            color: #333;
        }
        .total-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-top: 30px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
        }
        .total-row.grand-total {
            border-top: 2px solid #D4AF37;
            margin-top: 10px;
            padding-top: 15px;
            font-size: 18px;
            font-weight: bold;
            color: #D4AF37;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        }
        .status-confirmed {
            background: #d4edda;
            color: #155724;
        }
        .status-pending {
            background: #fff3cd;
            color: #856404;
        }
        .status-paid {
            background: #d1ecf1;
            color: #0c5460;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>PERÚ MYSTERIOUS</h1>
        <p>Comprobante de Reserva</p>
    </div>

    <div class="booking-code">
        <strong>Código de Reserva: {{ $booking->booking_code }}</strong>
    </div>

    <div class="section">
        <div class="section-title">Información del Tour</div>
        <div class="info-row">
            <div class="info-label">Tour:</div>
            <div class="info-value">{{ $booking->tour->name }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Destino:</div>
            <div class="info-value">{{ $booking->tour->location }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Fecha de viaje:</div>
            <div class="info-value">{{ \Carbon\Carbon::parse($booking->travel_date)->format('d/m/Y') }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Duración:</div>
            <div class="info-value">{{ $booking->tour->duration_days }} días / {{ $booking->tour->duration_nights }} noches</div>
        </div>
        <div class="info-row">
            <div class="info-label">Número de personas:</div>
            <div class="info-value">{{ $booking->number_of_people }}</div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Información del Cliente</div>
        <div class="info-row">
            <div class="info-label">Nombre:</div>
            <div class="info-value">{{ $booking->user->name }}</div>
        </div>
        <div class="info-row">
            <div class="info-label">Email:</div>
            <div class="info-value">{{ $booking->user->email }}</div>
        </div>
        @if($booking->user->phone)
        <div class="info-row">
            <div class="info-label">Teléfono:</div>
            <div class="info-value">{{ $booking->user->phone }}</div>
        </div>
        @endif
    </div>

    <div class="section">
        <div class="section-title">Estado de la Reserva</div>
        <div class="info-row">
            <div class="info-label">Estado:</div>
            <div class="info-value">
                <span class="status-badge status-{{ $booking->status }}">
                    {{ ucfirst($booking->status) }}
                </span>
            </div>
        </div>
        <div class="info-row">
            <div class="info-label">Estado de pago:</div>
            <div class="info-value">
                <span class="status-badge status-{{ $booking->payment_status }}">
                    {{ ucfirst($booking->payment_status) }}
                </span>
            </div>
        </div>
        @if($booking->payment_method)
        <div class="info-row">
            <div class="info-label">Método de pago:</div>
            <div class="info-value">{{ $booking->payment_method }}</div>
        </div>
        @endif
    </div>

    <div class="total-section">
        <div class="total-row">
            <span>Subtotal:</span>
            <span>S/. {{ number_format($booking->subtotal, 2) }}</span>
        </div>
        <div class="total-row">
            <span>IGV (18%):</span>
            <span>S/. {{ number_format($booking->tax, 2) }}</span>
        </div>
        <div class="total-row grand-total">
            <span>TOTAL PAGADO:</span>
            <span>S/. {{ number_format($booking->total, 2) }}</span>
        </div>
    </div>

    <div class="footer">
        <p>Fecha de emisión: {{ now()->format('d/m/Y H:i') }}</p>
        <p style="margin-top: 10px;">
            Este comprobante es válido como constancia de tu reserva.<br>
            Para consultas, contáctanos a soporte@perumysterious.com
        </p>
        <p style="margin-top: 20px; font-style: italic;">
            ¡Gracias por elegir Perú Mysterious para tu aventura!
        </p>
    </div>
</body>
</html>
