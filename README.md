# GetPayin 📝

A modern Laravel application for content management with post scheduling, multi-platform publishing, and user dashboards.

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)

## ✨ Features

- **User System**: Authentication with dashboards
- **Post Management**: Create, edit, schedule posts
- **Multi-Platform Support**: Connect to various social platforms
- **Media Handling**: Image uploads with validation
- **Modern Stack**: Laravel 10, Blade, Tailwind (optional)

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- MySQL 5.7+
- Node.js 16+

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/GetPayin.git
cd GetPayin

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Configure database in .env then:
php artisan migrate --seed

# Start development
npm run dev
php artisan serve
php artisan queue:work
php artisan schedule:run