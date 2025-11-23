---
sidebar_position: 5
---

# papacore config

Configure your Papacore project settings, primarily the vault path.

## Usage

```bash
papacore config
```

Or via npm/pnpm scripts:

```bash
npm run config
# or
pnpm config
```

## Interactive Configuration

Running this command starts an interactive prompt:

```
? Enter the path to your Obsidian vault: /Users/you/Documents/MyVault
```

Enter the absolute path to your Obsidian vault and press Enter.

## Configuration File

The command creates or updates `papacore.json` in your project root:

```json
{
  "vaultPath": "/Users/you/Documents/MyVault"
}
```

## Vault Path Requirements

The vault path should:

- Be an **absolute path** (not relative)
- Point to your **Obsidian vault root** directory
- Be a **valid, existing** directory
- Have **write permissions** for the build process

### Valid Examples

```
/Users/john/Documents/MyVault
C:\Users\john\Documents\MyVault
/home/john/Obsidian/MyVault
```

### Invalid Examples

```
~/Documents/MyVault          # Relative path with ~
../MyVault                   # Relative path
/Users/john/MyVault/Notes    # Subdirectory, not root
```

## How It's Used

The vault path is used by:

- `papacore install` - Copies built files to `[vault]/Datacore/`
- [`papacore dev`](./dev.md) - Auto-installs during development
- `papacore scan` - Scans vault for dependencies

## Manual Configuration

Instead of using the interactive command, you can manually create or edit `papacore.json`:

```json
{
  "vaultPath": "/path/to/your/vault"
}
```

## Multiple Vaults

If you work with multiple vaults, you can:

1. **Manually edit** `papacore.json` to switch vaults
2. **Run** `papacore config` to interactively change the vault
3. **Use environment variables** (advanced):
   ```bash
   VAULT_PATH=/path/to/vault npm run dev
   ```

## Validation

The config command validates that:

- The path exists
- The path is a directory
- You have write permissions

If validation fails, you'll see an error message.

## After Configuration

After setting your vault path:

1. **Enable the CSS snippet** in Obsidian:
   - Settings → Appearance → CSS Snippets
   - Refresh and enable `papacore`

2. **Start development**:
   ```bash
   npm run dev
   ```

3. **View your components** in Obsidian

## Troubleshooting

### Path Not Found

If you get "path not found":
- Verify the path is correct
- Use an absolute path, not relative
- Check for typos in the path

### Permission Denied

If you get "permission denied":
- Check folder permissions
- Make sure you own the vault directory
- Try running with appropriate permissions

### Invalid Path Format

On Windows, use either:
- Forward slashes: `C:/Users/john/Vault`
- Escaped backslashes: `C:\\Users\\john\\Vault`

## Related Commands

- [`papacore dev`](./dev.md) - Development with auto-install
