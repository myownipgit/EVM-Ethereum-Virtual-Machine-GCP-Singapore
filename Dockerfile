FROM nethermind/nethermind:latest

# Set up environment for Singapore deployment
ENV NETHERMIND_CONFIG=/nethermind/configs/nethermind.cfg \
    NETHERMIND_DATADIR=/nethermind/data \
    NETHERMIND_JSONRPCENABLED=true \
    NETHERMIND_JSONRPCPORT=8545 \
    NETHERMIND_JSONRPCHOST=0.0.0.0 \
    NETHERMIND_JSONRPCWEBSOCKETSPORT=8546 \
    NETHERMIND_METRICSPORT=9091 \
    NETHERMIND_HEALTHCHECKSPORT=8545

# Create necessary directories
USER root
RUN mkdir -p /nethermind/configs /nethermind/chainspec /nethermind/data /nethermind/logs && \
    chown -R app:app /nethermind/configs /nethermind/chainspec /nethermind/data /nethermind/logs

# Copy custom configuration files
COPY --chown=app:app config/nethermind.cfg /nethermind/configs/
COPY --chown=app:app config/genesis.json /nethermind/chainspec/

# Switch back to app user for security
USER app

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8545/health || exit 1

# Expose necessary ports
EXPOSE 8545 8546 30303 30303/udp 9091

# Mount points for persistent data
VOLUME ["/nethermind/data", "/nethermind/logs"]

# Set working directory
WORKDIR /nethermind

# Entry point
ENTRYPOINT ["./Nethermind.Runner"]
CMD ["--config", "/nethermind/configs/nethermind.cfg"]