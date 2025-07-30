# 🚀 Caching Proxy Server

> A high-performance CLI tool that creates a caching proxy server to accelerate API responses and reduce server load.

## ✨ Features

- 🔄 **Universal Proxy** - Forwards any HTTP request to the origin server
- ⚡ **Smart Caching** - Caches GET responses for lightning-fast subsequent requests
- 🕒 **TTL Support** - Automatic cache expiration (5 minutes default)
- 📊 **Cache Headers** - Adds `X-Cache: HIT/MISS` headers for debugging
- 🛠 **CLI Interface** - Easy command-line configuration
- 🔧 **Error Handling** - Graceful handling of connection failures
- 📈 **Performance Boost** - Significantly reduces response times for repeated requests

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed

### Installation

```bash
# Clone the repository
git clone https://github.com/Arin004joshi/Caching-Proxy.git
cd Caching-Proxy

# Install dependencies
npm install

# Make executable (optional)
chmod +x index.js
```

### Usage

```bash
# Basic usage
node index.js --origin http://dummyjson.com --port 3000

# Custom port
node index.js --origin https://jsonplaceholder.typicode.com --port 8080

# Ready to go - no additional setup required!
node index.js --origin http://api.example.com --port 3000
```

## 📖 How It Works

```
┌─────────┐    ┌─────────────────┐    ┌──────────────┐
│ Client  │───▶│ Caching Proxy   │───▶│ Origin Server│
└─────────┘    │                 │    └──────────────┘
               │ ┌─────────────┐ │
               │ │    Cache    │ │
               │ │  Storage    │ │
               │ └─────────────┘ │
               └─────────────────┘
```

1. **Request arrives** at the proxy server
2. **Cache check** - if response exists and is fresh, return immediately ⚡
3. **Forward request** to origin server if cache miss
4. **Store response** in cache for future requests
5. **Return response** to client with cache status header

## 🎯 Example Usage

### Test Cache Miss (First Request)
```bash
curl -I http://localhost:3000/products/1
# Returns: X-Cache: MISS
```

### Test Cache Hit (Subsequent Request)
```bash
curl -I http://localhost:3000/products/1
# Returns: X-Cache: HIT (much faster!)
```

### Different Endpoints
```bash
# All these work automatically
curl http://localhost:3000/users
curl http://localhost:3000/posts/1
curl http://localhost:3000/api/data
```

## ⚙️ Configuration Options

| Option | Description | Default | Required |
|--------|-------------|---------|----------|
| `--port` | Port to run the proxy server | 3000 | No |
| `--origin` | Origin server URL to proxy | - | Yes |

## 🔧 Technical Details

### Cache Strategy
- **Only GET requests** are cached (POST, PUT, DELETE are always forwarded)
- **5-minute TTL** - cached responses expire automatically using node-cache
- **In-memory storage** - uses node-cache for fast, lightweight caching
- **Unique keys** - based on HTTP method + full URL
- **Automatic cleanup** - expired entries are automatically removed

### Cache Key Format
```
GET:http://dummyjson.com/products/1
POST:http://dummyjson.com/products
```

### Performance Benefits
- **Faster Response Times** - Cached responses return in ~1ms vs 100-500ms
- **Reduced Server Load** - Origin server handles fewer duplicate requests
- **Bandwidth Savings** - Less network traffic between proxy and origin

## 🧪 Testing

```bash
# Start the proxy
node index.js --origin http://dummyjson.com --port 3000

# Terminal 2: Test cache miss
time curl http://localhost:3000/products/1

# Terminal 2: Test cache hit (should be much faster)
time curl http://localhost:3000/products/1
```

## 🛠 Development

```bash
# Install dev dependencies
npm install --save-dev nodemon

# Run in development mode
npm run dev

# Or with nodemon
npx nodemon index.js --origin http://dummyjson.com
```

## 📊 Cache Statistics

The proxy logs cache hits and misses:
```
[2024-07-31T10:30:15.123Z] GET /products/1 - Cache Key: GET:http://dummyjson.com/products/1
Cache MISS - forwarding to origin
[2024-07-31T10:30:16.145Z] GET /products/1 - Cache Key: GET:http://dummyjson.com/products/1
Cache HIT!
```

## 🔄 Cache Implementation

### Node-Cache (Current Implementation)
```javascript
import NodeCache from 'node-cache';

// Cache with 5-minute TTL and automatic cleanup
const cache = new NodeCache({ 
    stdTTL: 300,  // 5 minutes
    checkperiod: 60  // Check for expired keys every 60 seconds
});
```

**Benefits:**
- ✅ **Zero setup** - works out of the box
- ✅ **Lightweight** - no external dependencies
- ✅ **Auto-expiration** - built-in TTL support
- ✅ **Memory efficient** - automatic cleanup of expired entries
- ✅ **Perfect for development** and small to medium production loads

## 🚨 Error Handling

- **503 Service Unavailable** - When origin server is down
- **500 Internal Server Error** - For unexpected errors
- **Graceful Degradation** - Falls back to direct forwarding if cache fails

## 🔮 Future Enhancements

- [ ] Redis support for distributed caching
- [ ] Configurable TTL per endpoint
- [ ] Cache size limits and LRU eviction
- [ ] HTTP header-based cache control
- [ ] Cache warming strategies
- [ ] Metrics and monitoring dashboard
- [ ] Docker container support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

**[⭐ Star this repository](https://github.com/Arin004joshi/Caching-Proxy)** if you found it helpful!

</div>
