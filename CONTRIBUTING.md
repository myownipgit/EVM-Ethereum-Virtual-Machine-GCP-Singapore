# Contributing to EVM GCP Singapore Deployment

Thank you for your interest in contributing to this project! This document provides guidelines for contributing to the EVM deployment infrastructure.

## 🤝 How to Contribute

### 1. Fork the Repository
- Fork the project on GitHub
- Clone your fork locally
- Set up the development environment

### 2. Development Setup
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/EVM-GCP-Singapore-Deployment.git
cd EVM-GCP-Singapore-Deployment

# Install dependencies
chmod +x deploy.sh gcp-setup.sh
```

### 3. Making Changes
- Create a feature branch: `git checkout -b feature/your-feature-name`
- Make your changes
- Test thoroughly
- Commit with clear messages

### 4. Testing Requirements
Before submitting a PR, ensure:
- [ ] All scripts are executable and work correctly
- [ ] Kubernetes manifests are valid YAML
- [ ] Documentation is updated
- [ ] No sensitive information is included

### 5. Pull Request Process
1. Update the README.md with details of changes
2. Update the CHANGELOG.md if applicable
3. Ensure all tests pass
4. Submit a pull request with a clear description

## 📋 Contribution Areas

### Infrastructure
- GCP resource optimization
- Kubernetes configuration improvements
- Security enhancements
- Cost optimization

### Monitoring
- Grafana dashboard improvements
- Prometheus metrics enhancement
- Alerting rules
- Log aggregation

### Documentation
- README improvements
- Configuration examples
- Troubleshooting guides
- Architecture diagrams

### Smart Contracts
- Sample contract improvements
- Testing frameworks
- Deployment scripts
- Security audits

## 🔒 Security Guidelines

### Do NOT include:
- Private keys or secrets
- API keys or credentials
- Personal information
- Production configuration details

### DO include:
- Clear documentation
- Example configurations
- Security best practices
- Proper error handling

## 📝 Code Style

### Shell Scripts
- Use `set -e` for error handling
- Add comments for complex logic
- Use meaningful variable names
- Include help text

### Kubernetes YAML
- Use consistent indentation (2 spaces)
- Include resource limits
- Add labels and annotations
- Use meaningful names

### Documentation
- Use clear, concise language
- Include code examples
- Add diagrams where helpful
- Keep it up to date

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (GCP region, Kubernetes version, etc.)
- Relevant logs or error messages

## 💡 Feature Requests

For new features:
- Explain the use case
- Describe the proposed solution
- Consider backward compatibility
- Estimate impact on existing deployments

## 📊 Performance Improvements

When contributing performance improvements:
- Include benchmarks
- Document the improvement
- Consider cost implications
- Test under various conditions

## 🆘 Getting Help

If you need help:
- Check the documentation first
- Search existing issues
- Create a new issue with details
- Join community discussions

## 📈 Review Process

All contributions will be reviewed for:
- Code quality and style
- Security implications
- Performance impact
- Documentation completeness
- Testing coverage

## 🎯 Priority Areas

We especially welcome contributions in:
- Cost optimization strategies
- Security hardening
- Multi-region deployments
- Automated testing
- Monitoring improvements

## 📞 Contact

For questions or discussions:
- Create an issue on GitHub
- Use GitHub Discussions
- Follow the project for updates

Thank you for contributing to the EVM GCP Singapore Deployment project! 🚀