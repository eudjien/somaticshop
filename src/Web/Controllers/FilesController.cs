using AutoMapper;
using Core.Interfaces;
using Core.Interfaces.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FilesController : ControllerBase
    {

        private readonly IFileRepository _fileRepository;
        private readonly ILogger<FilesController> _logger;
        private readonly IMapper _mapper;
        private readonly IStorage _storage;

        public FilesController(
            IFileRepository fileRepository,
            IStorage storage,
            ILogger<FilesController> logger,
            IMapper mapper)
        {
            _fileRepository = fileRepository ?? throw new ArgumentNullException(nameof(fileRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _storage = storage ?? throw new ArgumentNullException(nameof(storage));
        }

        [HttpGet("{fileId}")]
        public async Task<IActionResult> Get([FromRoute] string fileId)
        {

            if (string.IsNullOrWhiteSpace(fileId))
            {
                return BadRequest();
            }

            var file = await _fileRepository.FindByIdAsync(fileId);
            if (file is null)
            {
                return NotFound();
            }

            try
            {
                var fs = new FileStream(Path.Combine(_storage.StoragePath, fileId), FileMode.Open, FileAccess.Read);
                return File(fs, file.ContentType, file.FileName);
            }
            catch (FileNotFoundException ex1)
            {
                return NotFound(ex1.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }
    }
}
