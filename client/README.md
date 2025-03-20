Footway+ Product Management System
==================================

A frontend application for managing product catalogs across multiple sales channels. This React + TypeScript app provides merchants with tools to efficiently handle large product datasets, enabling seamless product browsing and management.

🚀 Features
-----------

-   Upload product inventory via JSON files.
-   View products in a searchable, filterable data grid.
-   Enable/disable products for Multi-Sales Channels (MSC) individually or in bulk.
-   Set wholesale prices individually or in bulk.
-   View detailed product information, including images.

* * * * *

📂 Project Structure
--------------------
src/

├── components/                       # Reusable React components

│   ├── Table.tsx                     # Table displaying product data

│   ├── Table.spec.tsx                # Tests

│   ├── BulkUpdateForm.tsx            # Form to update multiple products 

│   ├── BulkUpdateForm.spec.tsx       # Tests

│   └── FileUploader.tsx              # Form to upload inventory JSON

│   └── FileUploader.spec.tsx         # Tests

│   └── ItemImage.tsx                 # Image component to show product image on detail page

│   └── ItemAttribute.tsx             # Component to show product's attributes on detail page

│   └── ItemDescription.tsx           # Component to show product's description on detail page

│   └── ItemHeader.tsx                # Component to identify product's on detail page

│   └── InderteminateCheckBox.tsx     # Axiliar component for allow update

│   └── Header.tsx                    # Auxiliar component for pages

│   └── Card.tsx                      # Auxiliar component for pages

│   └── NavBar.tsx                    # Auxiliar component 

├── pages/                            # Main pages of the application

│   └── ProductsPage.tsx              # Main page for product management

│   └── ProductPage.tsx               # Page to show product's details

│   └── HomePage.tsx                  # Main page 

├── layouts/                          # Main pages of the application

│   └── MainLayout.tsx                # App's main layout 

├── hooks/                            # Management of states and connection with API

│   └── requests.ts                   # Management of backend communication

│   └── useProducts.ts                # Management of states

├── constext/                         # Context 

│   └── ProductsContext.tsx           # Context provider of the application

server/                               # Express server for mock API

│   └── server.js                 

└── App.tsx                           # Root component`

* * * * *

🛠️ Installation & Setup
------------------------

1.  **Clone the repository**

    `git clone https://github.com/dendenmuniz/footway-dashboard.git
    cd footway-dashboard`

2.  **Install dependencies**

    `npm install`

3.  **Start the development server**

    `npm start`

4.  **Start the mock API server**

    `npm run server`

    The client runs on <http://localhost:3000>. The mock API runs on <http://localhost:8000>.

* * * * *

🧪 Testing
This project includes unit and integration tests using Jest and React Testing Library.

Run Tests
`npm run test`

* * * * *

📄 Usage
--------

1.  Navigate to the **Products** page.
2.  Use the **File Upload Form** to upload a product inventory JSON file.
3.  View products in the **Product Table**:
    -   Search for products using the search bar.
    -   Filter products by attributes (e.g., vendor, department, type).
4.  Bulk update or enable/disable products using the **Bulk Update Form**.
5.  View detailed product information, including images, by clicking on a product name.

* * * * *

📦 Sample Data
--------------

Use the following JSON structure for testing:

```
[
 {
    "id": 508,
    "merchant_id": "NET",
    "variant_id": "1844259",
    "product_name": "Biofinity Multifocal 6-pack",
    "supplier_model_number": null,
    "ean": ["885409752152"],
    "size": "-6.00/14.0/8.6///+2.00N/",
    "vendor": "Coopervision",
    "quantity": 2,
    "product_type": ["Contact Lenses"],
    "product_group": ["Contact Lenses"],
    "department": [null],
    "variant_created": "2024-11-01 15:58:15.000000 +00:00",
    "variant_updated": "2024-11-01 15:58:15.000000 +00:00",
    "inventory_level_created": "2024-11-01 15:58:15.000000 +00:00",
    "inventory_level_updated": "2024-11-01 15:58:15.000000 +00:00",
    "image_url": "https://images.footway.com/02/60900-77_001.png",
    "price": "2077",
    "product_description": "<span class=\"notranslate\">Biofinity Multifocal</span> is a progressive lens. This means it has different strengths for distance and near vision and is suitable for those who would otherwise need reading glasses or computer glasses.<br data-mce-fragment=\"1\"><br data-mce-fragment=\"1\">Regular <span class=\"notranslate\">Biofinity</span> lenses have been highly successful, and with this lens, anyone in need of multifocal lenses can also enjoy the fantastic features and comfort of <span class=\"notranslate\">Biofinity</span> lenses.<br data-mce-fragment=\"1\"><br data-mce-fragment=\"1\"><span class=\"notranslate\">Biofinity Multifocal</span> is a super-modern monthly lens to be used for daily wear or extended wear (up to 6 nights / 7 days) before being removed and cleaned. Follow your optometrist's instructions.<br data-mce-fragment=\"1\"><br data-mce-fragment=\"1\">Manufactured by <span class=\"notranslate\">CooperVision</span>.\n<table id=\"spectable\" cellpadding=\"4\" cellspacing=\"1\">\n<tbody>\n<tr id=\"tdspec\">\n<td id=\"tdh1\" colspan=\"2\"><b>Specifications<br data-mce-fragment=\"1\"></b></td>\n</tr>\n<tr id=\"tdspec\">\n<td id=\"tdhspec1\"><b>Model</b></td>\n<td id=\"tdhspec2\"><span class=\"notranslate\">Biofinity Multifocal</span></td>\n</tr>\n<tr id=\"tdspec\">\n<td id=\"tdhspec1\"><strong>Quantity</strong></td>\n<td id=\"tdhspec2\">6 <span data-mce-fragment=\"1\"> lenses per box</span>\n</td>\n</tr>\n<tr id=\"tdspec\">\n<td id=\"tdhspec1\"><strong>Manufacturer</strong></td>\n<td id=\"tdhspec2\"><span class=\"notranslate\">Coopervision</span></td>\n</tr>\n<tr id=\"tdspec\">\n<td id=\"tdhspec1\">\n<strong>Available Strengths</strong> <span>(Strength is often indicated by PWR or SPH on the box)</span>\n</td>\n<td id=\"tdhspec2\">+6.00 to -8.00  <br>X-strenghts (often denoted as <span class=\"notranslate\">ADD</span>) <br>+1.00N - +2.50N and <br>+1.00D - +2.50D</td>\n</tr>\n<tr id=\"tdspec\">\n<td id=\"tdhspec1\">\n<strong>Base Curve</strong> <span>(also referred to as BC or Radius)</span>\n</td>\n<td id=\"tdhspec2\">8.6</td>\n</tr>\n<tr id=\"tdspec\">\n<td id=\"tdhspec1\"><b>Diameter</b></td>\n<td id=\"tdhspec2\">14.0</td>\n</tr>\n<tr id=\"tdspec\">\n<td id=\"tdhspec1\"><b>Wear Time</b></td>\n<td id=\"tdhspec2\">1 month (up to 6 nights / 7 days).</td>\n</tr>\n<tr id=\"tdspec\">\n<td id=\"tdhspec1\"><b>Material</b></td>\n<td id=\"tdhspec2\">Comfilcon A</td>\n</tr>\n<tr id=\"tdspec\">\n<td id=\"tdhspec1\"><b>Water Content</b></td>\n<td id=\"tdhspec2\">48%</td>\n</tr>\n<tr id=\"tdspec\">\n<td id=\"tdhspec1\"><strong>Handling Tint</strong></td>\n<td id=\"tdhspec2\">Yes</td>\n</tr>\n</tbody>\n</table>"
  },
  {
    "id": 510,
    "merchant_id": "NET",
    "variant_id": "1809550",
    "product_name": "Dailies Aqua Comfort Plus Toric 30-pack",
    "supplier_model_number": null,
    "ean": ["630175548696"],
    "size": "+0.50/14.4/8.8/-1.75/80//",
    "vendor": "Alcon",
    "quantity": 2,
    "product_type": ["Contact Lenses"],
    "product_group": ["Contact Lenses"],
    "department": [null],
    "variant_created": "2024-11-01 15:58:15.000000 +00:00",
    "variant_updated": "2024-11-01 15:58:15.000000 +00:00",
    "inventory_level_created": "2024-11-01 15:58:15.000000 +00:00",
    "inventory_level_updated": "2024-11-01 15:58:15.000000 +00:00",
    "image_url": "https://images.footway.com/02/60900-41_001.png",
    "price": "2077",
    "product_description": "<p>Thanks to the advanced <span class=\"notranslate\">PRECISION CURVETM system</span>, <span class=\"notranslate\">Dailies AquaComfort Plus Toric</span> lenses provide the stability you need to correct your astigmatism. These lenses are equipped with dual Thin-zones that work in harmony with your natural blinks to ensure the lens stays in place, delivering clear and stable vision.<br data-mce-fragment=\"1\"><br data-mce-fragment=\"1\"><span class=\"notranslate\">Dailies AquaComfort Plus Toric</span> offers a unique triple-action moisture effect that rehydrates the lens with every blink. Say goodbye to dry or uncomfortable eyes! With these lenses, you can enjoy superior comfort all day long.</p>\n<p> </p>\n>"
  },
  {
    "id": 513,
    "merchant_id": "NET",
    "variant_id": "1808898",
    "product_name": "Dailies Aqua Comfort Plus Toric 30-pack",
    "supplier_model_number": null,
    "ean": ["630175518569"],
    "size": "+2.25/14.4/8.8/-0.75/90//",
    "vendor": "Alcon",
    "quantity": 3,
    "product_type": ["Contact Lenses"],
    "product_group": ["Contact Lenses"],
    "department": [null],
    "variant_created": "2024-11-01 15:58:15.000000 +00:00",
    "variant_updated": "2024-11-01 15:58:15.000000 +00:00",
    "inventory_level_created": "2024-11-01 15:58:15.000000 +00:00",
    "inventory_level_updated": "2024-11-01 15:58:15.000000 +00:00",
    "image_url": "https://images.footway.com/02/60900-41_001.png",
    "price": "2077",
    "product_description": "<p>Thanks to the advanced <span class=\"notranslate\">PRECISION CURVETM system</span>, <span class=\"notranslate\">Dailies AquaComfort Plus Toric</span> lenses provide the stability you need to correct your astigmatism. These lenses are equipped with dual Thin-zones that work in harmony with your natural blinks to ensure the lens stays in place, delivering clear and stable vision.<br data-mce-fragment=\"1\"><br data-mce-fragment=\"1\"><span class=\"notranslate\">Dailies AquaComfort Plus Toric</span> offers a unique triple-action moisture effect that rehydrates the lens with every blink. Say goodbye to dry or uncomfortable eyes! With these lenses, you can enjoy superior comfort all day long.</p>\n<p> </p>\n"
  },
  {
    "id": 519,
    "merchant_id": "NET",
    "variant_id": "1808950",
    "product_name": "Dailies Aqua Comfort Plus Toric 30-pack",
    "supplier_model_number": null,
    "ean": ["630175519979"],
    "size": "-0.00/14.4/8.8/-0.75/20//",
    "vendor": "Alcon",
    "quantity": 1,
    "product_type": ["Contact Lenses"],
    "product_group": ["Contact Lenses"],
    "department": [null],
    "variant_created": "2024-11-01 15:58:15.000000 +00:00",
    "variant_updated": "2024-11-01 15:58:15.000000 +00:00",
    "inventory_level_created": "2024-11-01 15:58:15.000000 +00:00",
    "inventory_level_updated": "2024-11-01 15:58:15.000000 +00:00",
    "image_url": "https://images.footway.com/02/60900-41_001.png",
    "price": "2077",
    "product_description": "<p>Thanks to the advanced <span class=\"notranslate\">PRECISION CURVETM system</span>, <span class=\"notranslate\">Dailies AquaComfort Plus Toric</span> lenses provide the stability you need to correct your astigmatism. These lenses are equipped with dual Thin-zones that work in harmony with your natural blinks to ensure the lens stays in place, delivering clear and stable vision.<br data-mce-fragment=\"1\"><br data-mce-fragment=\"1\"><span class=\"notranslate\">Dailies AquaComfort Plus Toric</span> offers a unique triple-action moisture effect that rehydrates the lens with every blink. Say goodbye to dry or uncomfortable eyes! With these lenses, you can enjoy superior comfort all day long.</p>\n<p> </p>\n>"
  },
  {
    "id": 521,
    "merchant_id": "NET",
    "variant_id": "1809577",
    "product_name": "Dailies Aqua Comfort Plus Toric 30-pack",
    "supplier_model_number": null,
    "ean": ["630175548962"],
    "size": "-0.00/14.4/8.8/-1.25/10//",
    "vendor": "Alcon",
    "quantity": 4,
    "product_type": ["Contact Lenses"],
    "product_group": ["Contact Lenses"],
    "department": [null],
    "variant_created": "2024-11-01 15:58:15.000000 +00:00",
    "variant_updated": "2024-11-01 15:58:15.000000 +00:00",
    "inventory_level_created": "2024-11-01 15:58:15.000000 +00:00",
    "inventory_level_updated": "2024-11-01 15:58:15.000000 +00:00",
    "image_url": "https://images.footway.com/02/60900-41_001.png",
    "price": "2077",
    "product_description": "<p>Thanks to the advanced <span class=\"notranslate\">PRECISION CURVETM system</span>, <span class=\"notranslate\">Dailies AquaComfort Plus Toric</span> lenses provide the stability you need to correct your astigmatism. These lenses are equipped with dual Thin-zones that work in harmony with your natural blinks to ensure the lens stays in place, delivering clear and stable vision.<br data-mce-fragment=\"1\"><br data-mce-fragment=\"1\"><span class=\"notranslate\">Dailies AquaComfort Plus Toric</span> offers a unique triple-action moisture effect that rehydrates the lens with every blink. Say goodbye to dry or uncomfortable eyes! With these lenses, you can enjoy superior comfort all day long.</p>\n<p> </p>\n"
  }
]
```

* * * * *

💻 Technologies Used
--------------------

-   **Frontend:** React, TypeScript
-   **UI Framework:** Tailwind CSS 
-   **Backend:** Express (Mock API)

* * * * *

📝 License
----------

This project is licensed under the MIT License. See the LICENSE file for details.

* * * * *
🙌 Acknowledgments
------------------

Special thanks to Footway+ for the opportunity to work on this challenge.

* * * * *

Feel free to let me know if you'd like me to include or modify anything!
