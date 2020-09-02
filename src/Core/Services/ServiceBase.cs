using AutoMapper;
using Microsoft.Extensions.Logging;
using System;

namespace Core.Services
{
    public abstract class ServiceBase
    {
        public IUnitOfWork UnitOfWork { get; private set; }
        protected IMapper Mapper { get; private set; }
        protected ILogger Logger { get; private set; }

        public ServiceBase(IUnitOfWork unitOfWork, IMapper mapper, ILogger logger)
        {
            UnitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            Mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            Logger = logger;
        }
    }
}
